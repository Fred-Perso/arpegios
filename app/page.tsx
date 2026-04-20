import Link from 'next/link';

function DecorativeFretboard() {
  const strings = [0, 1, 2, 3, 4, 5];
  const frets = [0, 1, 2, 3, 4, 5, 6, 7];
  const W = 560; const H = 110;
  const LEFT = 30; const RIGHT = 10;
  const TOP = 16; const BOT = 16;
  const fretW = (W - LEFT - RIGHT) / frets.length;
  const strH  = (H - TOP - BOT) / 5;
  const fretX = (f: number) => LEFT + f * fretW;
  const strY  = (s: number) => TOP + (5 - s) * strH;

  // Some decorative dots (chord tones scattered)
  const dots = [
    { s: 2, f: 0, color: '#f97316' }, { s: 4, f: 2, color: '#3b82f6' },
    { s: 1, f: 2, color: '#22c55e' }, { s: 3, f: 2, color: '#a855f7' },
    { s: 5, f: 4, color: '#f97316' }, { s: 0, f: 3, color: '#3b82f6' },
    { s: 2, f: 5, color: '#22c55e' }, { s: 4, f: 5, color: '#f97316' },
    { s: 1, f: 7, color: '#a855f7' }, { s: 3, f: 6, color: '#3b82f6' },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl opacity-30">
      {/* Nut */}
      <rect x={LEFT} y={TOP} width={4} height={H - TOP - BOT} fill="#d4a017" />
      {/* Fret lines */}
      {frets.map(f => (
        <line key={f} x1={fretX(f)} y1={TOP} x2={fretX(f)} y2={H - BOT}
          stroke="#374151" strokeWidth={f === 0 ? 0 : 1.5} />
      ))}
      {/* String lines */}
      {strings.map(s => (
        <line key={s} x1={LEFT} y1={strY(s)} x2={W - RIGHT} y2={strY(s)}
          stroke="#4b5563" strokeWidth={0.8 + (5 - s) * 0.28} />
      ))}
      {/* Fret markers */}
      {[1, 3, 5].map(f => (
        <circle key={f} cx={fretX(f) + fretW / 2} cy={H / 2} r={4} fill="#1f2937" />
      ))}
      {/* Dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={fretX(d.f) + fretW / 2} cy={strY(d.s)} r={9}
          fill={d.color} opacity={0.85} />
      ))}
    </svg>
  );
}

const FEATURES = [
  {
    href: '/arpeges',
    icon: '🎸',
    title: 'Arpèges',
    subtitle: '7 arpèges · 2 gammes · tout le manche',
    desc: 'Visualisez les 7 arpèges de 4 sons de la gamme majeure et mélodique mineure. 5 positions, audio, favoris.',
    color: 'from-orange-900/50 to-orange-800/20',
    border: 'border-orange-700/50',
    badge: 'bg-orange-500',
    badgeText: 'ARPÈGES',
    accent: '#f97316',
    stat: '14 gammes',
  },
  {
    href: '/accords',
    icon: '🎹',
    title: 'Accords',
    subtitle: 'Voicings jazz · diagrammes · manche',
    desc: 'Tous les voicings jazz (Position A, E, Drop 2, rootless) pour les 6 types d\'accords. Diagrammes et position sur le manche.',
    color: 'from-blue-900/50 to-blue-800/20',
    border: 'border-blue-700/50',
    badge: 'bg-blue-500',
    badgeText: 'ACCORDS',
    accent: '#3b82f6',
    stat: '24 voicings',
  },
  {
    href: '/accompagnement',
    icon: '🎵',
    title: 'Accompagnement',
    subtitle: 'Jouez avec un groupe jazz',
    desc: 'Séquenceur d\'accompagnement avec batterie, basse et piano. Choisissez vos accords, votre tempo et jouez.',
    color: 'from-green-900/50 to-green-800/20',
    border: 'border-green-700/50',
    badge: 'bg-green-500',
    badgeText: 'LIVE',
    accent: '#22c55e',
    stat: '5 instruments',
  },
  {
    href: '/tuto',
    icon: '📚',
    title: 'Théorie',
    subtitle: 'Des bases à l\'harmonie avancée',
    desc: 'Intervalles, gamme majeure, II–V–I, modes, enrichissements, substitutions tritoniques, analyse de standards.',
    color: 'from-purple-900/50 to-purple-800/20',
    border: 'border-purple-700/50',
    badge: 'bg-purple-500',
    badgeText: 'THÉORIE',
    accent: '#a855f7',
    stat: '15+ cours',
  },
];

const TUTO_QUICK = [
  { href: '/tuto/intervalles',             label: 'Intervalles',              icon: '📐' },
  { href: '/tuto/deux-cinq-un',            label: 'Le II–V–I',                icon: '⚡' },
  { href: '/tuto/enrichissements',         label: 'Enrichissements',          icon: '🎨' },
  { href: '/tuto/substitutions-tritoniques', label: 'Triton subs',            icon: '🔄' },
  { href: '/tuto/analyse-standards',       label: 'Analyse de standards',     icon: '🔍' },
  { href: '/tuto/reharmonisation',         label: 'Réharmonisation',          icon: '🎭' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative px-4 pt-14 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-8 left-1/4 w-64 h-64 bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-orange-300 uppercase tracking-widest">
            🎸 Jazz Guitar Tools
          </div>

          {/* Title */}
          <div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
              <span className="text-white">Arpège</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">ios</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl mt-3 max-w-lg mx-auto leading-relaxed">
              Visualisez. Écoutez. <span className="text-white font-semibold">Comprenez le jazz.</span>
            </p>
          </div>

          {/* Decorative fretboard */}
          <div className="flex justify-center py-2">
            <DecorativeFretboard />
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/arpeges"
              className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold px-7 py-3 rounded-2xl transition-all text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-400/30 hover:scale-105">
              Visualiser les arpèges →
            </Link>
            <Link href="/accords"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-7 py-3 rounded-2xl transition-all text-sm border border-gray-600 hover:border-gray-500">
              Explorer les accords
            </Link>
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap gap-6 justify-center text-center pt-2">
            {[
              { val: '12', label: 'tonalités' },
              { val: '7',  label: 'arpèges' },
              { val: '24', label: 'voicings' },
              { val: '15+', label: 'cours' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black text-orange-400">{s.val}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 pb-14 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <Link key={f.href} href={f.href}
              className={`group block rounded-3xl border bg-gradient-to-br p-6 transition-all hover:scale-[1.02] hover:shadow-2xl ${f.color} ${f.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{f.icon}</div>
                <div className="flex gap-2">
                  <span className={`${f.badge} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                    {f.badgeText}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-white">{f.title}</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: f.accent }}>{f.subtitle}</p>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">{f.desc}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-600 font-mono">{f.stat}</span>
                <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                  Ouvrir →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── THEORY QUICK ACCESS ── */}
      <section className="px-4 pb-14 max-w-5xl mx-auto">
        <div className="bg-gray-800/60 rounded-3xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Cours de théorie rapide</h2>
              <p className="text-gray-500 text-sm">Des bases au jazz avancé</p>
            </div>
            <Link href="/tuto"
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold border border-orange-800/50 rounded-lg px-3 py-1.5 hover:border-orange-600 transition-colors">
              Tout voir →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TUTO_QUICK.map(t => (
              <Link key={t.href} href={t.href}
                className="flex items-center gap-2.5 bg-gray-700/50 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 rounded-xl px-3 py-2.5 transition-all group">
                <span className="text-lg shrink-0">{t.icon}</span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-tight">{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-900/40 via-amber-900/30 to-orange-900/40 border border-orange-800/40 p-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
          <p className="text-2xl font-black text-white relative">
            Votre GPS pour <span className="text-orange-400">l'harmonie jazz</span>
          </p>
          <p className="text-gray-400 text-sm mt-2 relative max-w-sm mx-auto">
            Pas de mémorisation brute — comprenez la logique, voyez les patterns, entendez la musique.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6 relative">
            <Link href="/arpeges"
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
              🎸 Arpèges
            </Link>
            <Link href="/accords"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
              🎹 Accords
            </Link>
            <Link href="/accompagnement"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
              🎵 Accompagnement
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
