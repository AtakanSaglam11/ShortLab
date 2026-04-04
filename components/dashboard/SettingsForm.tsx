"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UserData = {
  email: string;
  plan: string;
  credits: number;
  createdAt: string;
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default function SettingsForm({ initialData }: { initialData: UserData }) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [signOutLoading, setSignOutLoading] = useState(false);

  async function handleEmailUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || newEmail === initialData.email) return;
    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(false);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setEmailError("Impossible de mettre à jour l'email. Vérifie l'adresse et réessaie.");
    } else {
      setEmailSuccess(true);
      setNewEmail("");
    }
    setEmailLoading(false);
  }

  async function handleSignOut() {
    setSignOutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  const planLabel =
    initialData.plan === "pro"
      ? "Pro"
      : initialData.plan === "starter"
      ? "Starter"
      : "Free";

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-8">
      {/* Account info */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-5 font-semibold text-white">Informations du compte</h2>
        <div className="flex flex-col gap-4">
          {/* Avatar + email */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-xl font-bold text-white">
              {initialData.email[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-medium text-white">{initialData.email}</p>
              <p className="text-sm text-gray-500">Membre depuis le {formatDate(initialData.createdAt)}</p>
            </div>
          </div>

          {/* Plan + credits */}
          <div className="mt-1 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <span className="text-sm text-gray-400">Plan</span>
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
                {planLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <svg className="h-4 w-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-bold text-white">{initialData.credits}</span>
              <span className="text-sm text-gray-500">crédit{initialData.credits !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Email update */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-1 font-semibold text-white">Modifier l&apos;adresse email</h2>
        <p className="mb-5 text-sm text-gray-500">
          Un lien de confirmation sera envoyé à la nouvelle adresse.
        </p>

        {emailSuccess && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Email de confirmation envoyé. Vérifie ta boîte mail.
          </div>
        )}

        {emailError && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {emailError}
          </div>
        )}

        <form onSubmit={handleEmailUpdate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="new-email" className="mb-1.5 block text-sm font-medium text-gray-300">
              Nouvelle adresse email
            </label>
            <input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => { setNewEmail(e.target.value); setEmailError(null); setEmailSuccess(false); }}
              placeholder={initialData.email}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={emailLoading || !newEmail || newEmail === initialData.email}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {emailLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Envoi...
              </>
            ) : (
              "Mettre à jour"
            )}
          </button>
        </form>
      </section>

      {/* Sign out */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-1 font-semibold text-white">Session</h2>
        <p className="mb-5 text-sm text-gray-500">Déconnecte-toi de ton compte ShortLab.</p>
        <button
          onClick={handleSignOut}
          disabled={signOutLoading}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-gray-300 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {signOutLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Déconnexion...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </>
          )}
        </button>
      </section>
    </div>
  );
}
