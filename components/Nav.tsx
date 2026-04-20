'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const TUTO_BASES = [
  { href: '/tuto/variete',      label: 'Je viens de la variété' },
  { href: '/tuto/intervalles',  label: 'Intervalles'            },
  { href: '/tuto/gammes',       label: 'Les gammes'             },
  { href: '/tuto/modes',        label: 'Les modes'              },
  { href: '/tuto',              label: 'Harmonie majeure'       },
  { href: '/tuto/pentatonique', label: 'Pentatonique jazz'      },
  { href: '/tuto/deux-cinq-un', label: 'II–V–I'                 },
  { href: '/tuto/standard',     label: 'Autumn Leaves'          },
  { href: '/tuto/histoire',     label: 'Histoire du jazz'       },
];

const TUTO_AVANCEE = [
  { href: '/tuto/enrichissements',          label: 'Enrichissements'        },
  { href: '/tuto/dominantes-secondaires',   label: 'Dominantes secondaires' },
  { href: '/tuto/substitutions-tritoniques',label: 'Substitutions triton.'  },
  { href: '/tuto/emprunts-modaux',          label: 'Emprunts modaux'        },
  { href: '/tuto/reharmonisation',          label: 'Réharmonisation'        },
  { href: '/tuto/analyse-standards',        label: 'Analyse de standards'   },
];

const MAIN_LINKS = [
  { href: '/arpeges',       label: '🎸 Arpèges'       },
  { href: '/accords',       label: '🎹 Accords'        },
  { href: '/accompagnement',label: '🎵 Accompagnement' },
  { href: '/guitarpro',     label: '🎼 Guitar Pro'     },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isTuto  = path.startsWith('/tuto');
  const isHome  = path === '/';

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-2.5 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap">

        {/* Logo */}
        <Link href="/"
          className={`text-orange-400 font-black tracking-tight shrink-0 text-lg transition-opacity ${isHome ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
          Arpègios
        </Link>

        {/* Main links */}
        <div className="flex gap-0.5 flex-wrap">
          {MAIN_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${path === href ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              {label}
            </Link>
          ))}

          {/* Théorie dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(v => !v)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${isTuto ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              📚 Théorie
              <span className="text-xs opacity-50">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
              <div
                className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl py-2 z-50 w-56 max-w-[calc(100vw-2rem)]"
                onClick={() => setOpen(false)}>

                {/* Bases */}
                <p className="text-[10px] text-gray-500 uppercase tracking-wider px-3 pt-1 pb-1.5 font-bold">
                  Harmonie de base
                </p>
                {TUTO_BASES.map(({ href, label }) => (
                  <Link key={href} href={href}
                    className={`block px-3 py-1.5 text-sm transition-colors
                      ${path === href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    {label}
                  </Link>
                ))}

                <div className="my-1.5 border-t border-gray-700/60 mx-3" />

                {/* Avancée */}
                <p className="text-[10px] text-purple-400 uppercase tracking-wider px-3 pt-1 pb-1.5 font-bold">
                  Harmonie avancée
                </p>
                {TUTO_AVANCEE.map(({ href, label }) => (
                  <Link key={href} href={href}
                    className={`block px-3 py-1.5 text-sm transition-colors
                      ${path === href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb in tuto */}
        {isTuto && (
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
            {(() => {
              const all = [...TUTO_BASES, ...TUTO_AVANCEE];
              const idx = all.findIndex(l => l.href === path);
              if (idx < 0) return null;
              return (
                <>
                  <span className="text-orange-400 font-bold">{all[idx].label}</span>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </nav>
  );
}
