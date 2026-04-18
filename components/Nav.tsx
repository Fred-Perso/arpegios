'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const TUTO_LINKS = [
  { href: '/tuto/variete',       label: 'Je viens de la variété' },
  { href: '/tuto/intervalles',   label: 'Intervalles'            },
  { href: '/tuto',               label: 'Harmonie majeure'       },
  { href: '/tuto/deux-cinq-un',  label: 'II–V–I'                 },
  { href: '/tuto/standard',      label: 'Autumn Leaves'          },
  { href: '/tuto/histoire',      label: 'Histoire du jazz'       },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isTuto = path.startsWith('/tuto');

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-2.5 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap">
        <Link href="/" className="text-orange-400 font-bold tracking-tight shrink-0">🎸 Arpèges Jazz</Link>

        {/* Main links */}
        <div className="flex gap-1">
          <Link href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${path === '/' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            Manche
          </Link>

          {/* Théorie dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(v => !v)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${isTuto ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              Théorie
              <span className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-1.5 z-50 w-52 max-w-[calc(100vw-2rem)]"
                   onClick={() => setOpen(false)}>
                <p className="text-xs text-gray-500 uppercase tracking-wider px-3 py-1.5">Parcours progressif</p>
                {TUTO_LINKS.map(({ href, label }, i) => (
                  <Link key={href} href={href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors
                      ${path === href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb when in tuto */}
        {isTuto && (
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
            {TUTO_LINKS.findIndex(l => l.href === path) >= 0 && (
              <>
                <span>Étape</span>
                <span className="text-orange-400 font-bold">
                  {TUTO_LINKS.findIndex(l => l.href === path) + 1}
                </span>
                <span>/ {TUTO_LINKS.length}</span>
                <span className="ml-2 text-gray-400">
                  {TUTO_LINKS.find(l => l.href === path)?.label}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
