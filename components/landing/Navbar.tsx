import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0a0a0f]/80 px-6 py-4 backdrop-blur-md">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25 transition-shadow group-hover:shadow-violet-500/40">
          <svg
            className="h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <span className="text-lg font-bold text-white">ShortLab</span>
      </Link>

      {/* Nav links */}
      <nav className="hidden items-center gap-8 md:flex">
        <Link
          href="#how-it-works"
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          Comment ça marche
        </Link>
        <Link
          href="#pricing"
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          Tarifs
        </Link>
      </nav>

      {/* Auth buttons */}
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="hidden text-sm text-gray-400 transition-colors hover:text-white md:block"
        >
          Se connecter
        </Link>
        <Link
          href="/auth/register"
          className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/35 hover:scale-105"
        >
          Commencer
        </Link>
      </div>
    </header>
  );
}
