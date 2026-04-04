import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">ShortLab</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Transforme tes vidéos YouTube en scripts courts viraux pour TikTok et Instagram Reels.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Produit
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Fonctionnalités", href: "#how-it-works" },
                  { label: "Tarifs", href: "#pricing" },
                  { label: "Se connecter", href: "/auth/login" },
                  { label: "S'inscrire", href: "/auth/register" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                Légal
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Conditions d'utilisation", href: "/terms" },
                  { label: "Politique de confidentialité", href: "/privacy" },
                  { label: "Mentions légales", href: "/legal" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-gray-600 md:flex-row">
          <p>© {new Date().getFullYear()} ShortLab. Tous droits réservés.</p>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-400">Supabase</span>
            <span>·</span>
            <span className="font-medium text-gray-400">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
