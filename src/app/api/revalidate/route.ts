import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

// Revalidation a la demande : le dashboard appelle cette route apres
// publication ou mise a jour d'un article pour rafraichir le site
// immediatement, sans attendre la revalidation periodique.
//
// Appel type :
//   https://<domaine>/api/revalidate?secret=SECRET&path=/article/mon-slug
//
// IMPORTANT (cout Vercel) : on revalide UNIQUEMENT les pages concernees.
// Purger tout le site (revalidatePath("/", "layout")) force la reecriture des
// ~90 pages a chaque publication et epuise le quota d'ecritures ISR.
// Anti-rafale : le dashboard sauvegarde automatiquement toutes les 30 s.
// Sans garde-fou, chaque sauvegarde declencherait une regeneration (facturee).
// On ignore les demandes repetees sur un meme chemin pendant 5 minutes.
const THROTTLE_MS = 5 * 60 * 1000;
const lastRevalidated = new Map<string, number>();

function shouldSkip(path: string): boolean {
  const now = Date.now();
  const last = lastRevalidated.get(path);
  if (last && now - last < THROTTLE_MS) return true;
  lastRevalidated.set(path, now);
  // Evite que la Map grossisse indefiniment
  if (lastRevalidated.size > 200) {
    for (const [key, time] of lastRevalidated) {
      if (now - time > THROTTLE_MS) lastRevalidated.delete(key);
    }
  }
  return false;
}

function handle(request: NextRequest): Response {
  const params = request.nextUrl.searchParams;
  const secret = params.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return Response.json(
      { revalidated: false, message: "Token invalide" },
      { status: 401 },
    );
  }

  const revalidated: string[] = [];
  const ignores: string[] = [];

  function touch(path: string) {
    if (shouldSkip(path)) {
      ignores.push(path);
      return;
    }
    revalidatePath(path);
    revalidated.push(path);
  }

  // Toujours : l'accueil (liste des derniers articles)
  touch("/");

  // Page de l'article concerne (accepte "path" ou "slug")
  const path = params.get("path");
  const slug = params.get("slug");
  if (path && path.startsWith("/")) touch(path);
  else if (slug) touch(`/article/${slug}`);

  // Page de la categorie concernee, si fournie
  const category = params.get("category");
  if (category) touch(`/categorie/${category}`);

  // La purge complete du site (?all=1) a ete retiree volontairement :
  // elle forcait la regeneration de ~94 pages (~470 unites d'ecriture ISR)
  // a chaque appel. Pour tout rafraichir, il suffit de redeployer.

  return Response.json({
    revalidated: revalidated.length > 0,
    paths: revalidated,
    ignores,
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  return handle(request);
}

export async function GET(request: NextRequest): Promise<Response> {
  return handle(request);
}
