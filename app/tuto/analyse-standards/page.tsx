import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

// Chord grid cell
function C({ sym, deg, color = '#4b5563', bars = 1, note }: {
  sym: string; deg?: string; color?: string; bars?: number; note?: string;
}) {
  return (
    <div className="relative rounded border p-2 text-center"
      style={{ borderColor: color, backgroundColor: color + '18', gridColumn: `span ${bars}` }}>
      <p className="font-mono font-bold text-sm text-white leading-tight">{sym}</p>
      {deg && <p className="text-[9px] mt-0.5" style={{ color }}>{deg}</p>}
      {note && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-900 border border-yellow-600 rounded px-1 text-[8px] text-yellow-400 whitespace-nowrap">
          {note}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div className="col-span-full text-[10px] font-bold uppercase tracking-widest pt-1 pb-0" style={{ color }}>
      {label}
    </div>
  );
}

const BLUE = '#3b82f6';
const RED  = '#ef4444';
const ORG  = '#f97316';
const IND  = '#6366f1';
const PUR  = '#a855f7';
const GRN  = '#10b981';
const AMB  = '#f59e0b';
const GRAY = '#6b7280';

export default function AnalyseStandardsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <Link href="/tuto" className="text-gray-400 hover:text-gray-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Analyse de standards</h1>
          <p className="text-gray-400 mt-1">Décrypter la logique harmonique de trois standards emblématiques</p>
        </div>

        {/* Méthode */}
        <Box>
          <h2 className="text-xl font-bold">Méthode d'analyse</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Analyser un standard, c'est identifier les <strong className="text-white">centres tonaux</strong>,
            repérer les <strong className="text-white">II–V–I</strong>, les <strong className="text-white">dominantes secondaires</strong>,
            les <strong className="text-white">emprunts modaux</strong> et les <strong className="text-white">modulations</strong>.
            Voici les étapes :
          </p>
          <ol className="space-y-1.5 text-sm text-gray-300">
            {[
              'Identifier la tonalité principale. Chercher la dernière résolution I.',
              'Repérer les II–V–I diatoniques (les plus fréquents).',
              "Pour chaque V7, vérifier s'il résout sur un accord attendu ou sur autre chose.",
              'Les accords avec des notes altérées (#/b) hors tonalité → dominante secondaire, triton sub ou emprunt.',
              'Une séquence de II–V dans une autre tonalité → modulation temporaire.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="grid grid-cols-5 gap-1 text-[9px] text-center">
            {[
              { label: 'Accord majeur 7', color: ORG },
              { label: 'Accord mineur 7', color: BLUE },
              { label: 'Dominant 7',      color: RED  },
              { label: 'Demi-dim. / m7b5',color: PUR  },
              { label: 'Triton sub / emp.',color: IND  },
            ].map(l => (
              <div key={l.label} className="rounded p-1" style={{ backgroundColor: l.color + '25', borderLeft: `2px solid ${l.color}` }}>
                <div className="w-3 h-3 rounded-full mx-auto mb-0.5" style={{ backgroundColor: l.color }}/>
                <p style={{ color: l.color }}>{l.label}</p>
              </div>
            ))}
          </div>
        </Box>

        {/* Blue Bossa */}
        <Box color="bg-blue-900/15 border border-blue-800/40">
          <h2 className="text-xl font-bold text-blue-200">Blue Bossa — Joe Henderson (1963)</h2>
          <p className="text-gray-400 text-sm">
            16 mesures · tonalité principale : <span className="text-white font-bold">Do mineur</span> · modulation vers <span className="text-white font-bold">Ré♭ majeur</span>
          </p>

          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <SectionLabel label="A — Do mineur (mesures 1–8)" color={BLUE}/>
            <C sym="Cm7"    deg="Im7"      color={BLUE} />
            <C sym="Cm7"    deg="Im7"      color={BLUE} />
            <C sym="Fm7"    deg="IVm7"     color={BLUE} />
            <C sym="Fm7"    deg="IVm7"     color={BLUE} />
            <C sym="Dm7b5"  deg="IIø7"     color={PUR} />
            <C sym="G7b9"   deg="V7alt"    color={RED}  note="Alt. — forte tension"/>
            <C sym="Cm7"    deg="Im7"      color={BLUE} />
            <C sym="Cm7"    deg="Im7"      color={BLUE} />

            <SectionLabel label="B — Modulation vers Ré♭ majeur (mesures 9–12)" color={GRN}/>
            <C sym="Ebm7"   deg="IIm7/Db"  color={GRN}  note="II de Db maj"/>
            <C sym="Ab7"    deg="V7/Db"    color={GRN}  note="V de Db maj"/>
            <C sym="Dbmaj7" deg="I△7/Db"   color={AMB}  note="Nouvelle tonique"/>
            <C sym="Dbmaj7" deg="I△7/Db"   color={AMB} />

            <SectionLabel label="Retour — Cadence vers Do mineur (mesures 13–16)" color={RED}/>
            <C sym="Dm7b5"  deg="IIø7/Cm"  color={PUR} />
            <C sym="G7b9"   deg="V7alt/Cm" color={RED}  note="Triton: G→Db résout en Do"/>
            <C sym="Cm7"    deg="Im7"       color={BLUE} />
            <C sym="Cm7"    deg="Im7"       color={BLUE} />
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">Points clés :</p>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li className="flex gap-2"><span className="text-blue-400">▸</span> La section A est entièrement en Do mineur (tonique, sous-dominante mineur, II–V–I mineur)</li>
              <li className="flex gap-2"><span className="text-green-400">▸</span> La section B module vers Ré♭ majeur via son propre II–V (Ebm7–Ab7). Modulation de demi-ton !</li>
              <li className="flex gap-2"><span className="text-red-400">▸</span> G7b9 utilise une tension altérée (b9 = Ab) — note commune avec Db majeur → liaison élégante entre les tonalités</li>
              <li className="flex gap-2"><span className="text-yellow-400">▸</span> Ré♭ est le substitut tritonique de Sol — pas un hasard que ces deux tonalités coexistent dans ce standard</li>
            </ul>
          </div>
        </Box>

        {/* All The Things You Are */}
        <Box color="bg-amber-900/15 border border-amber-800/40">
          <h2 className="text-xl font-bold text-amber-200">All The Things You Are — Kern/Hammerstein (1939)</h2>
          <p className="text-gray-400 text-sm">
            36 mesures · voyage à travers <span className="text-white font-bold">6 centres tonaux</span> · structure AABA
          </p>

          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <SectionLabel label="Section A1 — Lab majeur (mesures 1–8)" color={ORG}/>
            <C sym="Fm7"    deg="VIm7/Ab"   color={BLUE} />
            <C sym="Bbm7"   deg="IIm7/Ab"   color={BLUE} />
            <C sym="Eb7"    deg="V7/Ab"      color={RED}  note="II–V–I en Ab"/>
            <C sym="Ab△7"   deg="I△7/Ab"     color={ORG} />
            <C sym="Db△7"   deg="IV△7/Ab"    color={ORG} />
            <C sym="G7"     deg="V7/C"       color={RED}  note="Pivot vers Do maj"/>
            <C sym="C△7"    deg="I△7/C"      color={ORG} />
            <C sym="C△7"    deg=""            color={ORG} />

            <SectionLabel label="Section A2 — Mi♭ majeur (mesures 9–16)" color={GRN}/>
            <C sym="Cm7"    deg="VIm7/Eb"   color={BLUE} />
            <C sym="Fm7"    deg="IIm7/Eb"   color={BLUE} />
            <C sym="Bb7"    deg="V7/Eb"      color={RED}  note="II–V–I en Eb"/>
            <C sym="Eb△7"   deg="I△7/Eb"    color={ORG} />
            <C sym="Ab△7"   deg="IV△7/Eb"   color={ORG} />
            <C sym="D7"     deg="V7/G"       color={RED}  note="Pivot vers Sol maj"/>
            <C sym="G△7"    deg="I△7/G"     color={ORG} />
            <C sym="G△7"    deg=""           color={ORG} />

            <SectionLabel label="Section B — Mi majeur puis Sol majeur (mesures 17–24)" color={PUR}/>
            <C sym="Am7"    deg="IIm7/G"    color={BLUE} />
            <C sym="D7"     deg="V7/G"       color={RED} />
            <C sym="G△7"    deg="I△7/G"     color={ORG} bars={2} />
            <C sym="F#m7"   deg="IIm7/E"    color={BLUE} note="II–V–I en Mi"/>
            <C sym="B7"     deg="V7/E"       color={RED} />
            <C sym="E△7"    deg="I△7/E"     color={AMB} bars={2} />

            <SectionLabel label="Bridge — Retour vers Fa majeur (mesures 25–32)" color={RED}/>
            <C sym="C7#11"  deg="V7/F"       color={RED}  note="Lydien dominant"/>
            <C sym="C7#11"  deg=""            color={RED} />
            <C sym="F△7"    deg="I△7/F"     color={ORG} bars={2} />
            <C sym="Bm7b5"  deg="IIø7/Am"   color={PUR} />
            <C sym="E7b9"   deg="V7alt/Am"   color={RED}  note="V7/VIm en F"/>
            <C sym="Am△7"   deg="IVm△7?"    color={IND}  note="Emprunt min. harm."/>
            <C sym="Abm7"   deg="TritII"     color={IND}  note="Trit. sub II–V"/>
            <C sym="Db7"    deg="TritV"      color={IND} />
            <C sym="G△7"    deg="I△7/G"     color={ORG} />
            <C sym="—"      deg=""           color={GRAY} />
            <C sym="F#m7"   deg="IIm7/E"    color={BLUE} />
            <C sym="B7"     deg="V7/E"       color={RED} />
            <C sym="E△7"    deg="I△7/E"     color={AMB} bars={2} />
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">Points clés :</p>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li className="flex gap-2"><span className="text-amber-400">▸</span> Le morceau commence sur le VIm7 de Ab — jamais sur la tonique. Technique "en suspension".</li>
              <li className="flex gap-2"><span className="text-orange-400">▸</span> Les A1 et A2 sont des II–V–I complets mais dans des tonalités différentes (Ab, Eb, C, G).</li>
              <li className="flex gap-2"><span className="text-green-400">▸</span> Le bridge utilise C7#11 (son lydien-dominant) pour une couleur très moderne avant de résoudre sur F.</li>
              <li className="flex gap-2"><span className="text-indigo-400">▸</span> La fin du bridge contient un II–V tritonique classique (Abm7–Db7 → G△7).</li>
              <li className="flex gap-2"><span className="text-red-400">▸</span> Le morceau parcourt les tonalités de Ab, Eb, C, G, E, F, A, G, E — c'est une valise complète d'harmonie jazz.</li>
            </ul>
          </div>
        </Box>

        {/* Autumn Leaves */}
        <Box color="bg-orange-900/15 border border-orange-800/40">
          <h2 className="text-xl font-bold text-orange-200">Autumn Leaves — Kosma/Mercer (1945)</h2>
          <p className="text-gray-400 text-sm">
            32 mesures · tonalité : <span className="text-white font-bold">Sol mineur</span> / <span className="text-white font-bold">Si♭ majeur</span> (tonalités relatives)
          </p>

          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <SectionLabel label="Section A — Enchaînements II–V–I (mesures 1–8)" color={ORG}/>
            <C sym="Cm7"    deg="IIm7/Bb"   color={BLUE} />
            <C sym="F7"     deg="V7/Bb"      color={RED} />
            <C sym="Bb△7"   deg="I△7/Bb"    color={ORG} />
            <C sym="Eb△7"   deg="IV△7/Bb"   color={ORG} />
            <C sym="Am7b5"  deg="IIø7/Gm"   color={PUR} />
            <C sym="D7b9"   deg="V7alt/Gm"  color={RED}  note="Tension max"/>
            <C sym="Gm7"    deg="Im7/Gm"    color={BLUE} />
            <C sym="Gm7"    deg=""           color={BLUE} />

            <SectionLabel label="Section B — Même matériel, cadence finale en Gm (mesures 9–16)" color={RED}/>
            <C sym="Cm7"    deg="IIm7/Bb"   color={BLUE} />
            <C sym="F7"     deg="V7/Bb"     color={RED} />
            <C sym="Bb△7"   deg="I△7/Bb"   color={ORG} />
            <C sym="Eb△7"   deg="IV△7/Bb"  color={ORG} />
            <C sym="Am7b5"  deg="IIø7/Gm"  color={PUR} />
            <C sym="D7b9"   deg="V7alt/Gm" color={RED} />
            <C sym="Gm△7"  deg="Im△7/Gm"  color={BLUE} note="7e maj = résolution finale"/>
            <C sym="Gm△7"  deg=""          color={BLUE} />
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">Points clés :</p>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li className="flex gap-2"><span className="text-orange-400">▸</span> Le morceau contient deux II–V–I : l'un vers Bb majeur (mesures 1–3), l'autre vers Sol mineur (mesures 5–7).</li>
              <li className="flex gap-2"><span className="text-red-400">▸</span> D7b9 = dominant altéré vers Gm. La b9 (Eb) est aussi la tonique de Eb△7 juste avant — liaison très soignée.</li>
              <li className="flex gap-2"><span className="text-blue-400">▸</span> La structure utilise les deux tonalités relatives (Bb majeur et Sol mineur) dans la même grille — ambiguïté tonale contrôlée.</li>
              <li className="flex gap-2"><span className="text-green-400">▸</span> En version réharmonisée, D7b9 est souvent remplacé par Ab7 (triton sub) pour une basse Eb→D→C→Bb fluide.</li>
            </ul>
          </div>
        </Box>

        {/* Tableau récap */}
        <Box>
          <h2 className="text-xl font-bold">Récapitulatif — Patterns les plus fréquents</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 uppercase border-b border-gray-700">
                  <th className="text-left py-2 pr-3">Pattern</th>
                  <th className="text-left py-2 pr-3">Exemple</th>
                  <th className="text-left py-2">Reconnaître</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {[
                  ['II–V–I majeur',         'Dm7→G7→C△7',       'Mineur 7 + dominant 7 + majeur 7 en quintes descendantes'],
                  ['II–V–I mineur',          'Dm7b5→G7b9→Cm△7',  'Demi-dim + dom altéré + mineur avec 7e majeure'],
                  ['Dominante secondaire',   'A7→Dm7',           'V7 qui résout sur un accord mineur diatonique'],
                  ['Modulation II–V',        'Ebm7→Ab7→Db△7',    'II–V–I dans une autre tonalité que la principale'],
                  ['Triton sub',             'Db7→C△7',          'V7 qui descend d\'un demi-ton vers sa cible'],
                  ['Emprunt IVm',            'Fm7 en Do majeur', 'Accord mineur sur le IV d\'une tonalité majeure'],
                  ['Turnaround I–VI–II–V',   'C△7→Am7→Dm7→G7',  '4 accords en descente de quintes vers le I'],
                ].map(([pat, ex, rec]) => (
                  <tr key={pat}>
                    <td className="py-2 pr-3 font-bold text-white">{pat}</td>
                    <td className="py-2 pr-3 font-mono text-orange-300">{ex}</td>
                    <td className="py-2 text-gray-400">{rec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Retour au parcours
          </Link>
          <Link href="/tuto/reharmonisation"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Réharmonisation
          </Link>
          <Link href="/"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Ouvrir le visualiseur
          </Link>
        </div>
      </div>
    </main>
  );
}
