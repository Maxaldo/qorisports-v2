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

  function touch(path: string) {
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

  // Purge complete uniquement si explicitement demandee (?all=1)
  if (params.get("all") === "1") {
    revalidatePath("/", "layout");
    revalidated.push("(tout le site)");
  }

  return Response.json({ revalidated: true, paths: revalidated });
}

export async function POST(request: NextRequest): Promise<Response> {
  return handle(request);
}

export async function GET(request: NextRequest): Promise<Response> {
  return handle(request);
}
