import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

// Revalidation a la demande : WordPress appelle cette route apres publication
// ou mise a jour d'un article pour rafraichir le site immediatement, sans
// attendre la revalidation periodique (60s).
//
// Webhook a configurer cote WordPress (POST ou GET) :
//   https://<domaine>/api/revalidate?secret=VOTRE_SECRET
function handle(request: NextRequest): Response {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return Response.json(
      { revalidated: false, message: "Token invalide" },
      { status: 401 },
    );
  }

  // Purge l'ensemble du cache et reconstruit au prochain acces.
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}

export async function POST(request: NextRequest): Promise<Response> {
  return handle(request);
}

export async function GET(request: NextRequest): Promise<Response> {
  return handle(request);
}
