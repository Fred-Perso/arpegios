import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

// Gammes parallèles à Do (même fondamentale, modes différents)
const PARALLEL_MODES = [
  { mode: 'C Majeur (Ionien)',  notes: ['C','D','E','F','G','A','B'],    color: '#f97316', diff: []                   },
  { mode: 'C Dorien',          notes: ['C','D','Eb','F','G','A','Bb'],   color: '#3b82f6', diff: ['Eb','Bb']          },
  { mode: 'C Phrygien',        notes: ['C','Db','Eb','F','G','Ab','Bb'], color: '#8b5cf6', diff: ['Db','Eb','Ab','Bb'] },
  { mode: 'C Lydien',          notes: ['C','D','E','F#','G','A','B'],    color: '#10b981', diff: ['F#']               },
  { mode: 'C Mixolydien',      notes: ['C','D','E','F','G','A','Bb'],    color: '#f59e0b', diff: ['Bb']               },
  { mode: 'C Éolien (mineur)', notes: ['C','D','Eb','F','G','Ab','Bb'],  color: '#6366f1', diff: ['Eb','Ab','Bb']     },
];

function ModeComparisonSVG({ modeIdx }: { modeIdx: number }) {
  const major = PARALLEL_MODES[0];
  const mode  = PARALLEL_MODES[modeIdx];
  const W = 420; const CY = 40; const R = 16; const GAP = 56;
  const nx = (i: number) => 24 + i * GAP + GAP / 2;

  return (
    <svg viewBox={`0 0 ${W} 100`} className="w-full" style={{ minWidth: 320 }}>
      {/* Major row label */}
      <text x={2} y={28} fontSize={8} fill="#6b7280">Majeur</text>
      {/* Mode row label */}
      <text x={2} y={76} fontSize={8} fill={mode.color}>{mode.mode.split(' ')[1]}</text>

      {major.notes.map((n, i) => {
        const x = nx(i);
        const modNote = mode.notes[i];
        const changed = mode.diff.includes(modNote);
        return (
          <g key={i}>
            {/* Major note */}
            <circle cx={x} cy={CY - 18} r={R} fill="#f9731630" stroke="#f97316" strokeWidth={1.5}/>
            <text x={x} y={CY - 18 + 5} textAnchor="middle" fontSize={10} fill="white">{n}</text>
            {/* Mode note */}
            <circle cx={x} cy={CY + 18} r={R}
              fill={changed ? mode.color + '30' : '#1f2937'}
              stroke={changed ? mode.color : '#374151'}
              strokeWidth={changed ? 2 : 1}
            />
            <text x={x} y={CY + 18 + 5} textAnchor="middle" fontSize={10}
              fill={changed ? mode.color : '#6b7280'}
              fontWeight={changed ? 'bold' : 'normal'}>
              {modNote}
            </text>
            {/* Change arrow */}
            {changed && (
              <g>
                <line x1={x} y1={CY - 18 + R + 1} x2={x} y2={CY + 18 - R - 1}
                  stroke={mode.color} strokeWidth={1} strokeDasharray="2 2" opacity={0.6}/>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const BORROWED = [
  {
    chord: 'IVm7',
    example: 'Fm7',
    source: 'Aeolien / Dorien',
    color: '#6366f1',
    notes: 'F–Ab–C–Eb',
    usage: 'Après le IVmaj7, crée une couleur mélancolique avant de revenir au I. Très courant dans le pop et le jazz.',
    songs: ['Misty (IVm après IVmaj7)', 'My Funny Valentine'],
  },
  {
    chord: 'bVII△7',
    example: 'Bb△7',
    source: 'Mixolydien / Éolien',
    color: '#f59e0b',
    notes: 'Bb–D–F–A',
    usage: 'Accord de couleur "rock/blues" dans un contexte majeur. Peut fonctionner comme passage vers le IV ou le I.',
    songs: ['Watermelon Man', 'Road Song (W. Montgomery)'],
  },
  {
    chord: 'bVI△7',
    example: 'Ab△7',
    source: 'Éolien / Phrygien',
    color: '#8b5cf6',
    notes: 'Ab–C–Eb–G',
    usage: 'Couleur sombre et romantique. Souvent utilisé dans les progressions descendantes (I–bVII–bVI–V).',
    songs: ['All The Things You Are (séquence)', 'Autumn Leaves'],
  },
  {
    chord: 'bIII△7',
    example: 'Eb△7',
    source: 'Éolien / Dorien',
    color: '#3b82f6',
    notes: 'Eb–G–Bb–D',
    usage: 'Mediant plat, couleur "jazz moderne". Peut remplacer le Im dans un contexte mineur.',
    songs: ['So What (Miles Davis)', 'Impressions'],
  },
  {
    chord: 'bII7',
    example: 'Db7',
    source: 'Phrygien',
    color: '#ef4444',
    notes: 'Db–F–Ab–Cb',
    usage: 'Napolitain / substitut tritonique du V7. Demi-ton au-dessus de la tonique — résolution très forte.',
    songs: ['Lush Life', 'nombreux standards tardifs'],
  },
  {
    chord: 'IVm△7',
    example: 'Fm△7',
    source: 'Harmonique mineur',
    color: '#10b981',
    notes: 'F–Ab–C–E',
    usage: 'Accord très tendu, couleur "cinématique". La 7e majeure sur un accord mineur crée une dissonance expressive.',
    songs: ['Naima (John Coltrane)'],
  },
];

export default function EmpruntsModauxPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <Link href="/tuto" className="text-purple-400 hover:text-purple-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Les emprunts modaux</h1>
          <p className="text-gray-400 mt-1">Emprunter des accords aux modes parallèles pour colorer une tonalité majeure</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">1. Modes parallèles vs modes relatifs</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            Deux concepts à ne pas confondre :
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-900 rounded-xl p-4 border border-purple-800/40">
              <p className="font-bold text-purple-300 mb-2">Modes parallèles</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Même fondamentale, structure différente.
                C majeur / C dorien / C mixolydien / C phrygien…
                <br/><br/>
                <strong className="text-white">C'est ce dont on parle ici.</strong> On reste sur Do,
                on emprunte des notes (et donc des accords) aux modes qui commencent aussi sur Do.
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <p className="font-bold text-gray-400 mb-2">Modes relatifs</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Même notes, fondamentale différente.
                C majeur (ionien) → D dorien → E phrygien…
                <br/><br/>
                Ici on ne change pas de notes — on change juste de "centre de gravité".
                C'est la base de l'harmonisation diatonique classique.
              </p>
            </div>
          </div>
        </Box>

        <Box color="bg-purple-900/15 border border-purple-800/30">
          <h2 className="text-xl font-bold">2. Les notes apportées par chaque mode parallèle</h2>
          <p className="text-gray-400 text-xs mb-3">
            Comparaison avec Do majeur — notes modifiées en couleur
          </p>
          <div className="space-y-4">
            {[1, 4, 5].map(modeIdx => {
              const m = PARALLEL_MODES[modeIdx];
              return (
                <div key={modeIdx} className="bg-gray-900 rounded-xl p-3">
                  <p className="text-xs font-bold mb-2" style={{ color: m.color }}>{m.mode}</p>
                  <ModeComparisonSVG modeIdx={modeIdx} />
                  <p className="text-xs text-gray-500 mt-1">
                    Notes différentes : {m.diff.length > 0 ? m.diff.join(', ') : 'aucune'}
                  </p>
                </div>
              );
            })}
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">3. Les 6 emprunts les plus utilisés en Do majeur</h2>
          <div className="space-y-4">
            {BORROWED.map(b => (
              <div key={b.chord} className="bg-gray-900 rounded-xl p-4">
                <div className="flex flex-wrap items-start gap-3 mb-2">
                  <div className="rounded-lg border px-3 py-2 text-center shrink-0"
                    style={{ borderColor: b.color, backgroundColor: b.color + '18' }}>
                    <p className="font-mono font-bold text-lg text-white">{b.example}</p>
                    <p className="text-xs font-bold" style={{ color: b.color }}>{b.chord}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-1">
                      <span className="text-xs bg-gray-800 text-gray-400 rounded px-2 py-0.5 font-mono">{b.notes}</span>
                      <span className="text-xs text-gray-500 rounded px-2 py-0.5 border border-gray-700">
                        Emprunté de : {b.source}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">{b.usage}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {b.songs.map(s => (
                    <span key={s} className="text-xs bg-gray-800 text-gray-500 rounded px-2 py-0.5 italic">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>

        <Box color="bg-indigo-900/20 border border-indigo-800/40">
          <h2 className="text-xl font-bold text-indigo-200">4. Comment les identifier dans une grille</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Un emprunt modal se reconnaît à la présence d'une note étrangère à la tonalité principale.
            La démarche d'analyse :
          </p>
          <ol className="space-y-2 text-sm text-gray-300">
            {[
              'Identifier la tonalité principale du morceau.',
              'Repérer les accords qui contiennent une ou plusieurs notes absentes de cette tonalité.',
              'Vérifier si cet accord appartient à un mode parallèle (même fondamentale, gamme différente).',
              'Si oui → emprunt modal. Sinon → dominante secondaire, triton sub, ou modulation.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-700 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="bg-gray-900 rounded-xl p-3 text-sm">
            <p className="text-white font-semibold mb-1">Exemple : Misty (E. Garner) en Eb majeur</p>
            <div className="grid grid-cols-4 gap-1 text-xs font-mono mb-2">
              {['Ebmaj7','Bbm7','Eb7','Abmaj7','Abm7','Db7','Ebmaj7','Cm7'].map((c, i) => (
                <div key={i} className={`text-center rounded p-1.5 ${
                  c === 'Abm7' ? 'bg-indigo-900/50 border border-indigo-700 text-indigo-300' :
                  c === 'Eb7'  ? 'bg-red-900/30 border border-red-800 text-red-300' :
                  'bg-gray-800 text-gray-300'
                }`}>{c}</div>
              ))}
            </div>
            <p className="text-gray-400 text-xs">
              <span className="text-indigo-300 font-bold">Abm7</span> = IVm7 (emprunt aeolien — Ab mineur dans Eb majeur).
              {' '}<span className="text-red-300 font-bold">Eb7</span> = I7 = V7/IV (dominante secondaire du IV).
            </p>
          </div>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto/reharmonisation"
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Suivant : Réharmonisation →
          </Link>
          <Link href="/tuto/substitutions-tritoniques"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Substitutions tritoniques
          </Link>
        </div>
      </div>
    </main>
  );
}
