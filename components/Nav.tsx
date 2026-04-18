'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        <span className="text-orange-400 font-bold text-lg tracking-tight">🎸 Arpèges Jazz</span>
        <div className="flex gap-1">
          <Link href="/"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${path === '/' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            Manche
          </Link>
          <Link href="/tuto"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${path === '/tuto' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            Théorie
          </Link>
        </div>
      </div>
    </nav>
  );
}
