import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

const CHROMA = ['C','C#','D','Eb','E','F','F#/Gb','G','Ab','A','Bb','B'];

function TritoneCircleSVG({ v7idx = 7, subIdx = 1 }: { v7idx?: number; subIdx?: number }) {
  const CX = 130; const CY = 130; const R = 100; const NR = 18;
  const notes = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
  const tritoneNotes = [
    { idx: 7,  note: 'G',  label: 'G7',   color: '#ef4444' },
    { idx: 1,  note: 'Db', label: 'Db7',  color: '#3b82f6' },
  ];
  const isV7   = (i: number) => i === v7idx;
  const isSub  = (i: number) => i === subIdx;

  // Tritone inner chord tones shared: B and F (indices 11 and 5)
  const sharedA = { idx: 11, note: 'B'  };
  const sharedB = { idx: 5,  note: 'F'  };

  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto">
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R + NR + 4} fill="none" stroke="#1f2937" strokeWidth={1}/>
      {notes.map((n, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = CX + R * Math.cos(angle);
        const y = CY + R * Math.sin(angle);
        const hi = isV7(i) || isSub(i);
        const color = isV7(i) ? '#ef4444' : isSub(i) ? '#3b82f6' : '#374151';
        const textColor = isV7(i) ? '#ef4444' : isSub(i) ? '#60a5fa' : '#6b7280';
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={NR}
              fill={hi ? color + '30' : '#111827'}
              stroke={color} strokeWidth={hi ? 2.5 : 1}
            />
            <text x={x} y={y + 4} textAnchor="middle" fontSize={hi ? 11 : 10}
              fontWeight={hi ? 'bold' : 'normal'} fill={textColor}>{n}</text>
          </g>
        );
      })}
      {/* Tritone line */}
      {(() => {
        const a1 = (v7idx * 30 - 90) * Math.PI / 180;
        const a2 = (subIdx * 30 - 90) * Math.PI / 180;
        const x1 = CX + (R - NR - 2) * Math.cos(a1);
        const y1 = CY + (R - NR - 2) * Math.sin(a1);
        const x2 = CX + (R - NR - 2) * Math.cos(a2);
        const y2 = CY + (R - NR - 2) * Math.sin(a2);
        return (
          <g>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="6 3" opacity={0.7}/>
            <text x={CX} y={CY - 14} textAnchor="middle" fontSize={9} fill="#9ca3af">6 demi-tons</text>
            <text x={CX} y={CY + 2} textAnchor="middle" fontSize={8} fill="#6b7280">(triton)</text>
          </g>
        );
      })()}
      {/* Shared tones annotation */}
      <text x={CX} y={CY + 20} textAnchor="middle" fontSize={8} fill="#fbbf24">B ↔ F</text>
      <text x={CX} y={CY + 32} textAnchor="middle" fontSize={7} fill="#4b5563">triton partagé</text>
      {/* Labels */}
      {tritoneNotes.map(t => {
        const angle = (t.idx * 30 - 90) * Math.PI / 180;
        const x = CX + (R + NR + 14) * Math.cos(angle);
        const y = CY + (R + NR + 14) * Math.sin(angle);
        return (
          <text key={t.idx} x={x} y={y + 4} textAnchor="middle" fontSize={9}
            fontWeight="bold" fill={t.color}>{t.label}</text>
        );
      })}
    </svg>
  );
}

function BassMotionSVG() {
  const rows = [
    { label: 'Original',   chords: ['Dm7','G7','C△7'],  bases: ['D','G','C'],  colors: ['#3b82f6','#ef4444','#f97316'] },
    { label: 'Trit. sub',  chords: ['Dm7','Db7','C△7'], bases: ['D','Db','C'], colors: ['#3b82f6','#6366f1','#f97316'] },
  ];
  const W = 340; const ROW_H = 55; const COL_W = 100;
  return (
    <svg viewBox={`0 0 ${W} ${rows.length * ROW_H + 20}`} className="w-full max-w-sm mx-auto">
      {rows.map((row, ri) => (
        <g key={ri}>
          <text x={4} y={ri * ROW_H + 20} fontSize={9} fill="#6b7280">{row.label}</text>
          {row.chords.map((c, ci) => {
            const x = 56 + ci * COL_W;
            const y = ri * ROW_H + 10;
            return (
              <g key={ci}>
                {ci > 0 && (
                  <line x1={x - COL_W + 42} y1={y + 18} x2={x - 8} y2={y + 18}
                    stroke={ri === 1 && ci === 2 ? '#10b981' : '#4b5563'} strokeWidth={1.5}
                    markerEnd="url(#arrow)"
                  />
                )}
                <rect x={x} y={y} width={84} height={36} rx={7}
                  fill={row.colors[ci] + '20'} stroke={row.colors[ci]} strokeWidth={1.5}/>
                <text x={x + 42} y={y + 15} textAnchor="middle" fontSize={12} fontWeight="bold" fill="white">{c}</text>
                <text x={x + 42} y={y + 30} textAnchor="middle" fontSize={9} fill={row.colors[ci]}>{row.bases[ci]}</text>
              </g>
            );
          })}
        </g>
      ))}
      <text x={4} y={rows.length * ROW_H + 16} fontSize={8} fill="#10b981">
        Db→C = demi-ton chromatique descendant
      </text>
    </svg>
  );
}

export default function SubstitutionsTritoniquesPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <Link href="/tuto" className="text-indigo-400 hover:text-indigo-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Les substitutions tritoniques</h1>
          <p className="text-gray-400 mt-1">Remplacer un V7 par l'accord situé un triton plus bas</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">1. Le triton partagé — pourquoi ça fonctionne</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            G7 contient le triton <strong className="text-white">B–F</strong> (3ce et b7 de G7).
            Db7 contient le triton <strong className="text-white">F–Cb</strong>… qui est la même chose que <strong className="text-white">F–B</strong> (Cb = B enharmonique).
            Ces deux accords partagent <strong className="text-yellow-300">exactement le même triton</strong>,
            juste inversé. C'est pour ça qu'ils créent la même tension et qu'ils peuvent résoudre
            vers le même accord cible.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <TritoneCircleSVG />
            <div className="space-y-3 text-sm flex-1">
              <div className="bg-gray-900 rounded-xl p-3 space-y-2 text-xs">
                <p className="text-white font-semibold">G7 = G – B – D – F</p>
                <p className="text-gray-400">Tierce : <span className="text-yellow-300 font-bold">B</span> — Septième : <span className="text-yellow-300 font-bold">F</span></p>
                <div className="border-t border-gray-700 pt-2"/>
                <p className="text-white font-semibold">Db7 = Db – F – Ab – Cb(=B)</p>
                <p className="text-gray-400">Tierce : <span className="text-yellow-300 font-bold">F</span> — Septième : <span className="text-yellow-300 font-bold">B</span></p>
                <div className="border-t border-gray-700 pt-2"/>
                <p className="text-indigo-300 font-semibold">→ Même triton B↔F, rôles inversés</p>
              </div>
              <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-xl p-3 text-xs">
                <p className="text-indigo-200 font-semibold mb-1">Distance = 6 demi-tons</p>
                <p className="text-gray-400">
                  Le triton divise l'octave en deux parties égales.
                  G et Db sont donc diamétralement opposés sur le cercle chromatique.
                  Tout accord dominant a exactement un seul substitut tritonique.
                </p>
              </div>
            </div>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">2. Le mouvement de basse chromatique</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            L'autre raison pour laquelle la substitution tritonique est si efficace :
            elle crée un <strong className="text-white">mouvement de basse chromatique</strong> par demi-ton vers la tonique.
          </p>
          <BassMotionSVG />
          <div className="bg-gray-900 rounded-xl p-3 text-sm">
            <p className="text-gray-300">
              Dans un II–V–I standard, la basse fait D→G→C (sauts de quarte).
              Avec le tritone sub, elle fait <strong className="text-white">D→Db→C</strong> — un glissement chromatique
              très élégant, très apprécié dans les ballades et le jazz moderne.
            </p>
          </div>
        </Box>

        <Box color="bg-indigo-900/20 border border-indigo-800/40">
          <h2 className="text-xl font-bold text-indigo-200">3. Table des substitutions en Do majeur</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
                  <th className="text-left py-2 pr-4">V7 original</th>
                  <th className="text-left py-2 pr-4">Triton sub</th>
                  <th className="text-left py-2 pr-4">Basse originale</th>
                  <th className="text-left py-2 pr-4">Basse sub</th>
                  <th className="text-left py-2">Résout sur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {[
                  ['G7',  'Db7', 'G',  'Db → C', 'C△7'  ],
                  ['A7',  'Eb7', 'A',  'Eb → D', 'Dm7'  ],
                  ['B7',  'F7',  'B',  'F → E',  'Em7'  ],
                  ['C7',  'Gb7', 'C',  'Gb → F', 'F△7'  ],
                  ['D7',  'Ab7', 'D',  'Ab → G', 'G7'   ],
                  ['E7',  'Bb7', 'E',  'Bb → A', 'Am7'  ],
                ].map(([v7, sub, bas, bsub, res]) => (
                  <tr key={v7}>
                    <td className="py-2 pr-4 font-bold text-red-300">{v7}</td>
                    <td className="py-2 pr-4 font-bold text-indigo-300">{sub}</td>
                    <td className="py-2 pr-4 font-mono text-gray-400">{bas}</td>
                    <td className="py-2 pr-4 font-mono text-green-400">{bsub}</td>
                    <td className="py-2 text-gray-400">{res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">4. Le II–V–I tritonique complet</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            On peut aussi substituer le IIm7 par le IIm7 du tritone sub, formant un
            nouveau II–V–I entièrement déplacé d'un triton.
          </p>
          <div className="space-y-3 text-sm">
            {[
              {
                label: 'II–V–I standard en Do',
                chords: [
                  { sym:'Dm7',  color:'#3b82f6' },
                  { sym:'G7',   color:'#ef4444' },
                  { sym:'C△7',  color:'#f97316' },
                ],
              },
              {
                label: 'V tritonique seul',
                chords: [
                  { sym:'Dm7',  color:'#3b82f6' },
                  { sym:'Db7',  color:'#6366f1' },
                  { sym:'C△7',  color:'#f97316' },
                ],
              },
              {
                label: 'II–V tritonique complet',
                chords: [
                  { sym:'Abm7', color:'#6366f1' },
                  { sym:'Db7',  color:'#6366f1' },
                  { sym:'C△7',  color:'#f97316' },
                ],
              },
            ].map(row => (
              <div key={row.label}>
                <p className="text-xs text-gray-500 mb-1">{row.label}</p>
                <div className="flex gap-2">
                  {row.chords.map(c => (
                    <div key={c.sym} className="flex-1 rounded-lg border text-center py-2"
                      style={{ borderColor: c.color, backgroundColor: c.color + '18' }}>
                      <p className="font-mono font-bold text-white">{c.sym}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs">
            Abm7→Db7 est le II–V de la tonalité de Db. On l'insère pour résoudre vers C — la descente chromatique Db→C est la résolution.
          </p>
        </Box>

        <Box color="bg-gray-800">
          <h2 className="text-xl font-bold">5. Exemples dans les standards</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="font-bold text-white mb-2">Autumn Leaves — fin de chorus</p>
              <div className="space-y-1 text-xs font-mono">
                <p className="text-gray-400">Original   : Am7b5 – D7 – Gm7</p>
                <p className="text-indigo-300">Trit. sub  : Am7b5 – Ab7 – Gm7</p>
                <p className="text-green-400">Basse      : A – Ab – G (½-ton chromatique)</p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="font-bold text-white mb-2">Turnaround classique I–VI–II–V réharmonisé</p>
              <div className="space-y-1 text-xs font-mono">
                <p className="text-gray-400">Original   : C△7 – Am7 – Dm7 – G7</p>
                <p className="text-indigo-300">Trit. sub  : C△7 – Eb7 – Dm7 – Db7</p>
                <p className="text-green-400">Basse      : C – Eb – D – Db – C (chromatique descendant)</p>
              </div>
            </div>
          </div>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto/emprunts-modaux"
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Suivant : Emprunts modaux →
          </Link>
          <Link href="/tuto/dominantes-secondaires"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Dominantes secondaires
          </Link>
        </div>
      </div>
    </main>
  );
}
