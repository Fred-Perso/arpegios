'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

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
  { href: '/tuto/enrichissements',           label: 'Enrichissements'        },
  { href: '/tuto/dominantes-secondaires',    label: 'Dominantes secondaires' },
  { href: '/tuto/substitutions-tritoniques', label: 'Substitutions triton.'  },
  { href: '/tuto/emprunts-modaux',           label: 'Emprunts modaux'        },
  { href: '/tuto/reharmonisation',           label: 'Réharmonisation'        },
  { href: '/tuto/analyse-standards',         label: 'Analyse de standards'   },
];

const MAIN_LINKS = [
  { href: '/arpeges',        label: 'Arpèges',        icon: '🎸' },
  { href: '/accords',        label: 'Accords',         icon: '🎹' },
  { href: '/accompagnement', label: 'Accompagnement',  icon: '🎵' },
  { href: '/guitarpro',      label: 'Guitar Pro',      icon: '🎼' },
];

export default function Nav() {
  const path = usePathname();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [theorieOpen, setTheorieOpen] = useState(false);
  const isTuto = path.startsWith('/tuto');

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [path]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const currentTutoLabel = [...TUTO_BASES, ...TUTO_AVANCEE].find(l => l.href === path)?.label;

  return (
    <>
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-2.5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="text-orange-400 font-black tracking-tight text-lg shrink-0">
            Arpègios
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1 ml-2">
            {MAIN_LINKS.map(({ href, label, icon }) => (
              <Link key={href} href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${path === href ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                {icon} {label}
              </Link>
            ))}

            {/* Théorie desktop dropdown */}
            <div className="relative">
              <button
                onClick={() => setTheorieOpen(v => !v)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${isTuto ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                📚 Théorie
                <svg className={`w-3 h-3 opacity-50 transition-transform ${theorieOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 12 12" fill="currentColor">
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </button>

              {theorieOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTheorieOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl py-2 z-50 w-60"
                    onClick={() => setTheorieOpen(false)}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider px-3 pt-1 pb-1.5 font-bold">Harmonie de base</p>
                    {TUTO_BASES.map(({ href, label }) => (
                      <Link key={href} href={href}
                        className={`block px-3 py-1.5 text-sm transition-colors
                          ${path === href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                        {label}
                      </Link>
                    ))}
                    <div className="my-1.5 border-t border-gray-700/60 mx-3" />
                    <p className="text-[10px] text-purple-400 uppercase tracking-wider px-3 pt-1 pb-1.5 font-bold">Harmonie avancée</p>
                    {TUTO_AVANCEE.map(({ href, label }) => (
                      <Link key={href} href={href}
                        className={`block px-3 py-1.5 text-sm transition-colors
                          ${path === href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Tuto breadcrumb */}
            {isTuto && currentTutoLabel && (
              <span className="ml-auto text-xs text-orange-400 font-semibold truncate max-w-[160px]">
                {currentTutoLabel}
              </span>
            )}
          </div>

          {/* Mobile: current page label + burger */}
          <div className="flex md:hidden items-center gap-2 flex-1 justify-end">
            {isTuto && currentTutoLabel && (
              <span className="text-xs text-orange-400 font-semibold truncate max-w-[120px]">{currentTutoLabel}</span>
            )}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gray-800 border border-gray-700 transition-colors active:bg-gray-700">
              <span className={`block w-5 h-0.5 bg-gray-300 rounded transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}/>
              <span className={`block w-5 h-0.5 bg-gray-300 rounded transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-5 h-0.5 bg-gray-300 rounded transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Slide-in panel */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900 border-l border-gray-700 z-50 md:hidden flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <Link href="/" className="text-orange-400 font-black text-lg" onClick={() => setMobileOpen(false)}>
            Arpègios
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4 px-3">

          {/* Outils */}
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2 mb-2">Outils</p>
          <div className="space-y-1 mb-5">
            {MAIN_LINKS.map(({ href, label, icon }) => (
              <Link key={href} href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                  ${path === href
                    ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                <span className="text-xl w-7 text-center">{icon}</span>
                {label}
                {path === href && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400"/>}
              </Link>
            ))}
          </div>

          {/* Théorie — bases */}
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2 mb-2">Harmonie de base</p>
          <div className="space-y-0.5 mb-5">
            {TUTO_BASES.map(({ href, label }) => (
              <Link key={href} href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${path === href
                    ? 'bg-gray-700 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                {path === href && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"/>}
                {label}
              </Link>
            ))}
          </div>

          {/* Théorie — avancée */}
          <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold px-2 mb-2">Harmonie avancée</p>
          <div className="space-y-0.5 mb-5">
            {TUTO_AVANCEE.map(({ href, label }) => (
              <Link key={href} href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${path === href
                    ? 'bg-gray-700 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                {path === href && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"/>}
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-gray-800">
          <Link href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm hover:text-white transition-colors">
            🏠 Accueil
          </Link>
        </div>
      </div>
    </>
  );
}
