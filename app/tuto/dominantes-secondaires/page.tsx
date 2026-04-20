import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

// Les dominantes secondaires en Do majeur
const SEC_DOMS = [
  { target: 'Dm7',  targetDeg: 'II',  secDom: 'A7',   secNote: 'C#', altNote: 'C',  leading: 'C#→D'  },
  { target: 'Em7',  targetDeg: 'III', secDom: 'B7',   secNote: 'D#', altNote: 'D',  leading: 'D#→E'  },
  { target: 'Fmaj7',targetDeg: 'IV',  secDom: 'C7',   secNote: 'Bb', altNote: 'B',  leading: 'E→F'   },
  { target: 'G7',   targetDeg: 'V',   secDom: 'D7',   secNote: 'F#', altNote: 'F',  leading: 'F#→G'  },
  { target: 'Am7',  targetDeg: 'VI',  secDom: 'E7',   secNote: 'G#', altNote: 'G',  leading: 'G#→A'  },
];

function ResolutionSVG({ secDom, target, secNote, leading, color }:
  { secDom: string; target: string; secNote: string; leading: string; color: string }) {
  return (
    <svg viewBox="0 0 260 70" className="w-full max-w-xs">
      <rect x={4} y={10} width={90} height={44} rx={8}
        fill={color + '25'} stroke={color} strokeWidth={2} />
      <text x={49} y={30} textAnchor="middle" fontSize={15} fontWeight="bold" fill="white">{secDom}</text>
      <text x={49} y={46} textAnchor="middle" fontSize={9} fill={color}>V7/x</text>

      {/* Arrow */}
      <line x1={98} y1={32} x2={152} y2={32} stroke="#6b7280" strokeWidth={2}/>
      <polygon points="152,32 144,27 144,37" fill="#6b7280"/>
      <text x={125} y={24} textAnchor="middle" fontSize={8} fill="#6b7280">{secNote}→{leading.split('→')[1]}</text>
      <text x={125} y={44} textAnchor="middle" fontSize={7} fill="#4b5563">note de guidage</text>

      <rect x={156} y={10} width={96} height={44} rx={8}
        fill="#1f2937" stroke="#4b5563" strokeWidth={1.5} />
      <text x={204} y={30} textAnchor="middle" fontSize={15} fontWeight="bold" fill="white">{target}</text>
      <text x={204} y={46} textAnchor="middle" fontSize={9} fill="#6b7280">cible</text>
    </svg>
  );
}

export default function DominanteSecondairesPage() {
  const colors = ['#3b82f6','#60a5fa','#f97316','#ef4444','#3b82f6'];

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <Link href="/tuto" className="text-red-400 hover:text-red-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Les dominantes secondaires</h1>
          <p className="text-gray-400 mt-1">Toniciser temporairement n'importe quel accord</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">1. Le principe</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            On sait que <span className="text-red-300 font-bold">G7</span> résout naturellement sur{' '}
            <span className="text-orange-300 font-bold">C△7</span> : c'est le V7→I de la tonalité de Do.
            Ce mécanisme fonctionne pour <strong className="text-white">n'importe quel accord</strong> :
            on peut construire un V7 qui résout sur le IIm7, sur le IVmaj7, sur le VIm7…
          </p>
          <div className="bg-gray-900 rounded-xl p-4 space-y-2 text-sm">
            <p className="text-white font-semibold">La règle :</p>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 bg-red-900/30 border border-red-800/50 rounded-lg p-3 text-center">
                <p className="text-red-300 font-bold text-lg">+P5</p>
                <p className="text-gray-400 text-xs">Monter d'une quinte juste</p>
                <p className="text-gray-400 text-xs">au-dessus de la cible</p>
              </div>
              <div className="flex items-center justify-center text-gray-500 text-xl">→</div>
              <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-center">
                <p className="text-white font-bold text-lg">V7</p>
                <p className="text-gray-400 text-xs">Rendre cet accord</p>
                <p className="text-gray-400 text-xs">dominant (triade maj + b7)</p>
              </div>
              <div className="flex items-center justify-center text-gray-500 text-xl">→</div>
              <div className="flex-1 bg-orange-900/30 border border-orange-800/50 rounded-lg p-3 text-center">
                <p className="text-orange-300 font-bold text-lg">cible</p>
                <p className="text-gray-400 text-xs">Résolution</p>
                <p className="text-gray-400 text-xs">forte vers l'accord visé</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              Ex : cible = Dm7. Quinte au-dessus de D = A. On fait A7 → Dm7. A7 est la dominante secondaire du II.
            </p>
          </div>
        </Box>

        <Box color="bg-red-900/15 border border-red-800/40">
          <h2 className="text-xl font-bold">2. Les 5 dominantes secondaires en Do majeur</h2>
          <p className="text-gray-400 text-xs mb-2">
            (Le I n'a pas de dominante secondaire diatonique séparée — G7 est déjà le V)
          </p>
          <div className="space-y-5">
            {SEC_DOMS.map((s, i) => (
              <div key={s.secDom} className="bg-gray-900 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="shrink-0">
                    <ResolutionSVG {...s} color={colors[i]} />
                  </div>
                  <div className="text-sm space-y-1 flex-1">
                    <p className="font-bold text-white">
                      V7/{s.targetDeg} = <span style={{ color: colors[i] }}>{s.secDom}</span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      Note introduite : <span className="text-white font-mono font-bold">{s.secNote}</span>{' '}
                      (absente de Do majeur — c'est la note de guidage vers {s.leading.split('→')[1]})
                    </p>
                    <p className="text-gray-500 text-xs">
                      Accord naturel en Do à cet endroit :{' '}
                      <span className="font-mono">{s.altNote === s.secNote ? '—' : `remplace le ${s.altNote}`}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">3. Notation dans une grille</h2>
          <p className="text-gray-300 text-sm mb-3">
            Les dominantes secondaires s'écrivent <strong className="text-white">V7/degré</strong> dans l'analyse
            ou directement avec leur nom (A7, B7, etc.) dans les grilles de jazz.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
                  <th className="text-left py-2 pr-4">Notation analytique</th>
                  <th className="text-left py-2 pr-4">Accord réel</th>
                  <th className="text-left py-2 pr-4">Note étrangère</th>
                  <th className="text-left py-2">Résout sur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {[
                  ['V7/II',  'A7',  'C#', 'Dm7'  ],
                  ['V7/III', 'B7',  'D#', 'Em7'  ],
                  ['V7/IV',  'C7',  'Bb', 'Fmaj7'],
                  ['V7/V',   'D7',  'F#', 'G7'   ],
                  ['V7/VI',  'E7',  'G#', 'Am7'  ],
                ].map(([ana, acc, note, res]) => (
                  <tr key={ana}>
                    <td className="py-2 pr-4 font-mono text-red-300">{ana}</td>
                    <td className="py-2 pr-4 font-bold text-white">{acc}</td>
                    <td className="py-2 pr-4 font-mono text-yellow-300">{note}</td>
                    <td className="py-2 text-gray-400">{res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        <Box color="bg-amber-900/20 border border-amber-800/40">
          <h2 className="text-xl font-bold text-amber-200">4. Exemples dans les standards</h2>
          <div className="space-y-4 text-sm">
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="font-bold text-white mb-2">Fly Me To The Moon (tonalité de Am)</p>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono mb-2">
                {['Am7','Dm7','G7','Cmaj7','Fmaj7','Bm7b5','E7','Am7'].map((c,i) => (
                  <div key={i} className={`text-center rounded p-1.5 ${c==='E7' ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-gray-800 text-gray-300'}`}>{c}</div>
                ))}
              </div>
              <p className="text-gray-400 text-xs">
                <span className="text-red-300 font-bold">E7</span> est V7/VI (V7 de Am).
                Introduit G# — note étrangère à Do majeur — pour renforcer la résolution vers Am7.
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="font-bold text-white mb-2">Autumn Leaves (key of G)</p>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono mb-2">
                {['Cm7','F7','Bbmaj7','Ebmaj7','Am7b5','D7','Gm7','—'].map((c,i) => (
                  <div key={i} className={`text-center rounded p-1.5 ${c==='D7' ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-gray-800 text-gray-300'}`}>{c}</div>
                ))}
              </div>
              <p className="text-gray-400 text-xs">
                <span className="text-red-300 font-bold">D7</span> = V7/Gm — dominante du Ier degré mineur.
                Crée la tension maximale avant la résolution.
              </p>
            </div>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">5. Le II de la dominante secondaire</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Comme tout V7, une dominante secondaire peut être précédée de <strong className="text-white">son propre IIm7</strong>,
            formant un mini II–V–I localisé.
          </p>
          <div className="space-y-3 text-sm">
            {[
              { before: 'Dm7 → G7 → C△7', after: 'Dm7 → G7 → Em7b5→A7 → Dm7', note: 'mini II-V ajouté avant le IIm7' },
              { before: 'Fmaj7 → Em7', after: 'Fmaj7 → Bm7b5→E7 → Am7', note: 'mini II-V/VI inséré' },
            ].map((ex, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-3">
                <p className="text-gray-500 text-xs font-mono">{ex.before}</p>
                <p className="text-white text-xs font-mono mt-1">↓  {ex.after}</p>
                <p className="text-amber-400 text-xs mt-1">{ex.note}</p>
              </div>
            ))}
          </div>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto/substitutions-tritoniques"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Suivant : Substitutions tritoniques →
          </Link>
          <Link href="/tuto/enrichissements"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Enrichissements
          </Link>
        </div>
      </div>
    </main>
  );
}
