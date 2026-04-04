import Link from "next/link";

const links = {
  product: [
    { label: "Comment ça marche", href: "#how-it-works" },
    { label: "Tarifs", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Se connecter", href: "/auth/login" },
  ],
  legal: [
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Mentions légales", href: "/legal" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600">
                <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-[15px] font-semibold text-white">ShortLab</span>
            </Link>
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-gray-500">
              Transforme tes vidéos YouTube en scripts viraux pour TikTok et Instagram Reels — en 30 secondes.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            >
              Commencer gratuitement
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Product links */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-600">Produit</p>
            <ul className="flex flex-col gap-2.5">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-500 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-600">Légal</p>
            <ul className="flex flex-col gap-2.5">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-500 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} ShortLab. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-700">
            <span>Propulsé par</span>
            <span className="font-medium text-gray-500">Supabase</span>
            <span>·</span>
            <span className="font-medium text-gray-500">Stripe</span>
            <span>·</span>
            <span className="font-medium text-gray-500">Anthropic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
