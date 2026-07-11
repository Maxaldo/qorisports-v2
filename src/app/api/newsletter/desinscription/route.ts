import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Desinscription newsletter via le lien contenu dans chaque email :
// {SITE}/api/newsletter/desinscription?token=xxxx
export async function GET(request: NextRequest): Promise<Response> {
  const token = request.nextUrl.searchParams.get("token");

  let message = "Lien de désinscription invalide.";
  if (token) {
    const { error } = await supabase.rpc("unsubscribe", { sub_token: token });
    message = error
      ? "Lien de désinscription invalide ou déjà utilisé."
      : "Vous êtes désinscrit(e) de la newsletter QoriSports. À bientôt !";
  }

  return new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Newsletter QoriSports</title></head>
    <body style="font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#f8fafc;margin:0">
    <div style="text-align:center;padding:2rem">
    <h1 style="font-size:1.25rem;color:#0f172a">${message}</h1>
    <a href="/" style="color:#16A34A;font-size:.9rem">Retour au site</a>
    </div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
