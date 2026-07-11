"use client";

import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

// Formulaire d'inscription a la newsletter (pied de page).
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "dup" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
    setState("loading");
    const { error } = await supabase.from("subscribers").insert({ email: value });
    if (!error) {
      setState("ok");
      setEmail("");
    } else if (error.code === "23505") {
      setState("dup");
    } else {
      setState("error");
    }
  }

  return (
    <div>
      <h4 className="text-lg font-semibold">Newsletter</h4>
      <p className="mt-3 text-sm text-white/85">
        Le meilleur du sport béninois dans votre boîte mail, chaque semaine.
      </p>
      <form onSubmit={subscribe} className="mt-3 flex max-w-sm gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="min-w-0 flex-1 rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-white/60"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="S'inscrire"
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          S&apos;inscrire
        </button>
      </form>
      {state === "ok" && (
        <p className="mt-2 text-sm text-green-300">Merci ! Vous êtes inscrit(e). 🎉</p>
      )}
      {state === "dup" && (
        <p className="mt-2 text-sm text-white/85">Cet email est déjà inscrit.</p>
      )}
      {state === "error" && (
        <p className="mt-2 text-sm text-red-300">Oups, réessayez dans un instant.</p>
      )}
    </div>
  );
}
