'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        <span className="text-orange-400 font-bold text-lg tracking-tight">🎸 Arpèges Jazz</span>
        <div className="flex gap-1 flex-wrap">
          {[
            { href: '/',                    label: 'Manche'          },
            { href: '/tuto',                label: 'Théorie'         },
            { href: '/tuto/intervalles',    label: 'Intervalles'     },
            { href: '/tuto/deux-cinq-un',   label: 'II–V–I'          },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${path === href ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
