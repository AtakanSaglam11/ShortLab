import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600">
            <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-white">ShortLab</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#how-it-works" className="text-sm text-gray-400 transition-colors hover:text-white">
            Comment ça marche
          </Link>
          <Link href="#pricing" className="text-sm text-gray-400 transition-colors hover:text-white">
            Tarifs
          </Link>
          <Link href="#faq" className="text-sm text-gray-400 transition-colors hover:text-white">
            FAQ
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden text-sm text-gray-400 transition-colors hover:text-white md:block"
          >
            Se connecter
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 active:scale-95"
          >
            Commencer
          </Link>
        </div>
      </div>
    </header>
  );
}
