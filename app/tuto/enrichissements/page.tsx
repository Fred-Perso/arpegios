import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

function ExtendedStackSVG() {
  const layers = [
    { note: 'A', role: '13e',  semis: '+9',  color: '#34d399', ext: true  },
    { note: 'F', role: '11e',  semis: '+5',  color: '#a78bfa', ext: true  },
    { note: 'D', role: '9e',   semis: '+2',  color: '#60a5fa', ext: true  },
    { note: 'B', role: '△7',   semis: '+11', color: '#f97316', ext: false },
    { note: 'G', role: '5e',   semis: '+7',  color: '#f97316', ext: false },
    { note: 'E', role: '3ce',  semis: '+4',  color: '#f97316', ext: false },
    { note: 'C', role: 'R',    semis: '0',   color: '#f97316', ext: false },
  ];
  const W = 320; const BAR_H = 30; const PAD = 20;
  const totalH = layers.length * BAR_H + PAD * 2;
  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} className="w-full max-w-sm mx-auto">
      {layers.map((l, i) => {
        const y = PAD + i * BAR_H;
        const barW = l.ext ? 160 : 200;
        return (
          <g key={i}>
            <rect x={20} y={y + 3} width={barW} height={BAR_H - 6} rx={6}
              fill={l.color + (l.ext ? '20' : '30')} stroke={l.color}
              strokeWidth={l.ext ? 1.5 : 2}
              strokeDasharray={l.ext ? '5 3' : 'none'}
            />
            <text x={28} y={y + BAR_H / 2 + 5} fontSize={13} fontWeight="bold" fill="white">{l.note}</text>
            <text x={52} y={y + BAR_H / 2 + 5} fontSize={10} fill={l.color}>{l.role}</text>
            <text x={barW + 28} y={y + BAR_H / 2 + 5} fontSize={9} fill="#6b7280">{l.semis} demi-t.</text>
            {l.ext && (
              <text x={250} y={y + BAR_H / 2 + 5} fontSize={8} fill={l.color + 'cc'}>tension</text>
            )}
          </g>
        );
      })}
      <text x={20} y={totalH - 4} fontSize={8} fill="#4b5563">Accord Cmaj7 étendu jusqu'à la 13e</text>
    </svg>
  );
}

function TensionTableSVG() {
  const cols = ['△7', 'm7', '7 (dom.)', 'ø7', 'm△7'];
  const rows = [
    { label: 'b9',   vals: ['✗','✗','✓ alt','✓','✗'],   color: '#f87171' },
    { label: '9',    vals: ['✓','✓','✓','✗','✓'],       color: '#60a5fa' },
    { label: '#9',   vals: ['✗','✗','✓ alt','✗','✗'],   color: '#f87171' },
    { label: '11',   vals: ['⚠','✓','—','✓','✓'],       color: '#a78bfa' },
    { label: '#11',  vals: ['✓','✗','✓','✗','✗'],       color: '#a78bfa' },
    { label: '13',   vals: ['✓','✓','✓','✗','✓'],       color: '#34d399' },
    { label: 'b13',  vals: ['✗','✗','✓ alt','✓','✗'],   color: '#f87171' },
  ];
  const COL_W = 68; const ROW_H = 26; const LBL_W = 46;
  const W = LBL_W + cols.length * COL_W + 10;
  const H = (rows.length + 1) * ROW_H + 10;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-x-auto" style={{ minWidth: 380 }}>
      {/* Header */}
      {cols.map((c, ci) => (
        <text key={ci} x={LBL_W + ci * COL_W + COL_W / 2} y={ROW_H - 6}
          textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight="bold">{c}</text>
      ))}
      {rows.map((row, ri) => (
        <g key={ri}>
          <rect x={0} y={ROW_H + ri * ROW_H} width={W} height={ROW_H}
            fill={ri % 2 === 0 ? '#1f293780' : 'transparent'} />
          <text x={LBL_W - 4} y={ROW_H + ri * ROW_H + ROW_H / 2 + 4}
            textAnchor="end" fontSize={11} fill={row.color} fontWeight="bold">{row.label}</text>
          {row.vals.map((v, ci) => (
            <text key={ci} x={LBL_W + ci * COL_W + COL_W / 2} y={ROW_H + ri * ROW_H + ROW_H / 2 + 4}
              textAnchor="middle" fontSize={10}
              fill={v.startsWith('✓') ? '#34d399' : v === '✗' ? '#4b5563' : v === '⚠' ? '#fbbf24' : '#9ca3af'}>
              {v}
            </text>
          ))}
        </g>
      ))}
      <text x={4} y={H - 2} fontSize={7} fill="#4b5563">⚠ = évité (clash avec la 3ce majeure) — alt = tension altérée</text>
    </svg>
  );
}

export default function EnrichissementsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <Link href="/tuto" className="text-teal-400 hover:text-teal-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Les enrichissements (extensions)</h1>
          <p className="text-gray-400 mt-1">9e, 11e, 13e — aller au-delà de la 7e pour colorer les accords</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">1. Le principe — continuer l'empilement de tierces</h2>
          <p className="text-gray-300 leading-relaxed text-sm">
            On a vu qu'un accord de 7e se construit en empilant 3 tierces au-dessus de la fondamentale (R–3–5–7).
            On peut <strong className="text-white">continuer exactement de la même façon</strong> : une tierce au-dessus de la 7e donne la 9e,
            une autre donne la 11e, une dernière donne la 13e.
            Ces 3 notes supplémentaires sont les <strong className="text-teal-300">enrichissements</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <ExtendedStackSVG />
            <div className="space-y-3 text-sm flex-1">
              <div className="bg-gray-900 rounded-xl p-3 text-xs space-y-1">
                <p className="text-white font-semibold mb-1">La règle de nommage :</p>
                <p className="text-gray-400">9e = 2de + 1 octave (= même note, registre supérieur)</p>
                <p className="text-gray-400">11e = 4te + 1 octave</p>
                <p className="text-gray-400">13e = 6te + 1 octave</p>
              </div>
              <div className="bg-teal-900/30 border border-teal-800/50 rounded-xl p-3 text-xs">
                <p className="text-teal-200 font-semibold mb-1">Pourquoi 9, 11, 13 et pas 2, 4, 6 ?</p>
                <p className="text-gray-400">
                  Par convention, on utilise ces numéros pour distinguer les enrichissements
                  (au-dessus de l'accord de 7e) des intervalles simples.
                  Une <span className="text-white">9e</span> est une 2de dans le registre aigu,
                  mais son rôle harmonique est différent.
                </p>
              </div>
            </div>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">2. Tensions disponibles vs notes à éviter</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Toutes les tensions ne fonctionnent pas sur tous les types d'accords.
            Une tension est <span className="text-green-400 font-bold">disponible</span> si elle ne crée pas
            de demi-ton avec une note de l'accord (ce qui provoquerait une dissonance brûlante non désirée).
            Elle est <span className="text-yellow-400 font-bold">à éviter</span> dans le cas contraire.
          </p>
          <div className="overflow-x-auto">
            <TensionTableSVG />
          </div>
        </Box>

        <Box color="bg-red-900/20 border border-red-800/40">
          <h2 className="text-xl font-bold text-red-200">3. Le cas spécial : les tensions du V7</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Le V7 (accord dominant) est le <strong className="text-white">seul accord</strong> qui peut accepter
            toutes les tensions, y compris altérées. On distingue deux "familles" :
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="font-bold text-amber-300">G7 "naturel" (mixolydien)</p>
              <p className="text-gray-400 text-xs">Tensions issues de la gamme de Do :</p>
              <div className="flex flex-wrap gap-2">
                {[['9','A'],['#11','C#'],['13','E']].map(([t,n]) => (
                  <span key={t} className="bg-amber-900/40 border border-amber-700 rounded px-2 py-1 text-xs font-mono">
                    <span className="text-amber-300">{t}</span> <span className="text-gray-400">({n})</span>
                  </span>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">Son "ouvert", lumineux, résolution douce</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="font-bold text-red-300">G7alt (gamme altérée)</p>
              <p className="text-gray-400 text-xs">Toutes les tensions sont altérées :</p>
              <div className="flex flex-wrap gap-2">
                {[['b9','Ab'],['#9','Bb'],['#11','C#'],['b13','Eb']].map(([t,n]) => (
                  <span key={t} className="bg-red-900/40 border border-red-700 rounded px-2 py-1 text-xs font-mono">
                    <span className="text-red-300">{t}</span> <span className="text-gray-400">({n})</span>
                  </span>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">Tension maximale, résolution très forte sur le Im</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-xs text-gray-400">
            <span className="text-white font-semibold">Astuce :</span> G7alt = les notes de la gamme de Lab mélodique montant (Ab melodic minor).
            C'est le 7e mode de cette gamme — une des formules les plus utiles du jazz moderne.
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">4. Notation et lecture des symboles</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { sym: 'Cmaj9',   meaning: 'C△7 + 9e naturelle (D)',              color: 'text-teal-300' },
              { sym: 'Dm11',    meaning: 'Dm7 + 9e + 11e (E + G)',              color: 'text-blue-300' },
              { sym: 'G13',     meaning: 'G7 + toutes les tensions jusqu\'à 13e', color: 'text-red-300'  },
              { sym: 'G7b9',    meaning: 'G7 + tension b9 (Ab)',                color: 'text-red-300'  },
              { sym: 'G7#9',    meaning: 'G7 + tension #9 (Bb) — "Jimi chord"', color: 'text-red-300'  },
              { sym: 'G7alt',   meaning: 'G7 toutes tensions altérées',         color: 'text-red-300'  },
              { sym: 'Cmaj7#11','meaning': 'C△7 + #11 (F#) — "son lydien"',    color: 'text-teal-300' },
              { sym: 'Am7(9)',   meaning: 'Am7 avec 9e ajoutée (B)',            color: 'text-blue-300' },
            ].map(r => (
              <div key={r.sym} className="bg-gray-900 rounded-xl p-3 flex gap-3 items-start">
                <span className={`font-mono font-bold text-sm shrink-0 w-20 ${r.color}`}>{r.sym}</span>
                <span className="text-gray-400 text-xs">{r.meaning}</span>
              </div>
            ))}
          </div>
        </Box>

        <Box color="bg-teal-900/20 border border-teal-800/40">
          <h2 className="text-xl font-bold text-teal-200">5. Exemples concrets dans un II–V–I en Do</h2>
          <div className="space-y-3 text-sm">
            {[
              {
                label: 'Version basique',
                chords: [
                  { sym: 'Dm7', role: 'II', color: '#3b82f6' },
                  { sym: 'G7',  role: 'V',  color: '#ef4444' },
                  { sym: 'C△7', role: 'I',  color: '#f97316' },
                ],
              },
              {
                label: 'Avec enrichissements naturels',
                chords: [
                  { sym: 'Dm9',    role: 'II', color: '#3b82f6' },
                  { sym: 'G13',    role: 'V',  color: '#ef4444' },
                  { sym: 'C△9',    role: 'I',  color: '#f97316' },
                ],
              },
              {
                label: 'Avec tensions altérées sur le V',
                chords: [
                  { sym: 'Dm9',    role: 'II', color: '#3b82f6' },
                  { sym: 'G7b9#11',role: 'V',  color: '#ef4444' },
                  { sym: 'C△9#11', role: 'I',  color: '#f97316' },
                ],
              },
            ].map(row => (
              <div key={row.label}>
                <p className="text-xs text-gray-500 mb-1">{row.label}</p>
                <div className="flex gap-2">
                  {row.chords.map(c => (
                    <div key={c.sym} className="flex-1 rounded-lg border text-center py-2"
                      style={{ borderColor: c.color, backgroundColor: c.color + '18' }}>
                      <p className="font-mono font-bold text-sm text-white">{c.sym}</p>
                      <p className="text-xs" style={{ color: c.color }}>{c.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto/dominantes-secondaires"
            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Suivant : Dominantes secondaires →
          </Link>
          <Link href="/tuto"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Retour au parcours
          </Link>
        </div>
      </div>
    </main>
  );
}
