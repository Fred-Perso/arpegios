import Link from 'next/link';

function Box({ title, children, accent = 'orange' }: { title: string; children: React.ReactNode; accent?: string }) {
  const border = accent === 'blue' ? 'border-blue-700' : accent === 'red' ? 'border-red-700' : 'border-orange-700';
  return (
    <section className={`bg-gray-800 rounded-2xl p-6 space-y-4 border-l-4 ${border}`}>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

// ── Gamme avec intervalles ────────────────────────────────────────────────────
function ScaleRow() {
  const notes = ['C','D','E','F','G','A','B','C'];
  const degs  = ['1','2','3','4','5','6','7','8'];
  const gaps  = ['T','T','½','T','T','T','½'];
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-0 min-w-[520px]">
        {notes.map((n, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex flex-col items-center w-12 ${i === 0 || i === 7 ? 'opacity-100' : 'opacity-90'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2
                ${i === 0 || i === 7 ? 'bg-orange-600 border-orange-400 text-white' : 'bg-gray-700 border-gray-500 text-gray-200'}`}>
                {n}
              </div>
              <span className="text-[10px] text-gray-500 mt-1">{degs[i]}</span>
            </div>
            {i < 7 && (
              <div className={`flex flex-col items-center w-8`}>
                <div className={`h-1 w-full ${gaps[i] === 'T' ? 'bg-gray-600' : 'bg-yellow-600'}`}/>
                <span className={`text-[9px] mt-1 font-bold ${gaps[i] === 'T' ? 'text-gray-500' : 'text-yellow-400'}`}>{gaps[i] === 'T' ? 'ton' : '½ ton'}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Construction d'un accord par empilement de tierces ────────────────────────
function ChordBuild({ root, notes, quality }: { root: string; notes: string[]; quality: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {[...notes].reverse().map((n, i) => {
        const level = notes.length - 1 - i;
        const colors = ['bg-orange-700','bg-red-800','bg-blue-800','bg-gray-700'];
        const labels = ['fondamentale','tierce','quinte','septième'];
        return (
          <div key={i} className={`flex items-center gap-2 ${colors[level]} rounded-lg px-3 py-1.5`}
               style={{ width: `${100 + level * 20}px` }}>
            <span className="text-white font-bold text-sm w-5 text-center">{n}</span>
            <span className="text-gray-300 text-[10px]">{labels[level]}</span>
          </div>
        );
      })}
      <div className="mt-1 text-center">
        <span className="text-orange-400 font-bold text-sm">{root}</span>
        <span className="text-gray-400 text-xs ml-1">{quality}</span>
      </div>
    </div>
  );
}

// ── Table harmonisation complète ──────────────────────────────────────────────
function HarmoTable() {
  const rows = [
    { deg:'I',   root:'C', notes:['C','E','G','B'], name:'C△7',  type:'Maj7',  func:'Tonique',        fc:'text-orange-300', fr:'bg-orange-900/40 border-orange-700', highlight: true },
    { deg:'II',  root:'D', notes:['D','F','A','C'], name:'Dm7',  type:'m7',    func:'Sous-dominante', fc:'text-blue-300',   fr:'bg-blue-900/40 border-blue-700',     highlight: true },
    { deg:'III', root:'E', notes:['E','G','B','D'], name:'Em7',  type:'m7',    func:'Tonique',        fc:'text-orange-300', fr:'bg-gray-800 border-gray-600' },
    { deg:'IV',  root:'F', notes:['F','A','C','E'], name:'F△7',  type:'Maj7',  func:'Sous-dominante', fc:'text-blue-300',   fr:'bg-gray-800 border-gray-600' },
    { deg:'V',   root:'G', notes:['G','B','D','F'], name:'G7',   type:'Dom7',  func:'Dominante',      fc:'text-red-300',    fr:'bg-red-900/40 border-red-700',       highlight: true },
    { deg:'VI',  root:'A', notes:['A','C','E','G'], name:'Am7',  type:'m7',    func:'Tonique',        fc:'text-orange-300', fr:'bg-gray-800 border-gray-600' },
    { deg:'VII', root:'B', notes:['B','D','F','A'], name:'Bø7',  type:'m7b5',  func:'Dominante',      fc:'text-red-300',    fr:'bg-gray-800 border-gray-600' },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="text-[10px] text-gray-500 uppercase tracking-wider">
            <th className="text-left py-2 pr-3 font-normal">Degré</th>
            <th className="text-left py-2 pr-3 font-normal">Notes (tierces empilées)</th>
            <th className="text-left py-2 pr-3 font-normal">Accord</th>
            <th className="text-left py-2 pr-3 font-normal">Qualité</th>
            <th className="text-left py-2 font-normal">Fonction</th>
          </tr>
        </thead>
        <tbody className="space-y-1">
          {rows.map(r => (
            <tr key={r.deg} className={`border rounded-lg ${r.fr} ${r.highlight ? 'font-semibold' : 'opacity-70'}`}>
              <td className="py-2 pr-3 pl-2 rounded-l-lg">
                <span className={`font-bold ${r.highlight ? r.fc : 'text-gray-400'}`}>{r.deg}</span>
              </td>
              <td className="py-2 pr-3">
                <span className="font-mono text-gray-300">{r.notes.join(' – ')}</span>
              </td>
              <td className="py-2 pr-3">
                <span className={`font-bold ${r.highlight ? r.fc : 'text-gray-400'}`}>{r.name}</span>
              </td>
              <td className="py-2 pr-3 text-gray-400 text-xs">{r.type}</td>
              <td className={`py-2 pr-2 rounded-r-lg text-xs ${r.fc}`}>{r.func}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-gray-500 mt-2">Les degrés surlignés (II, V, I) forment le II–V–I.</p>
    </div>
  );
}

// ── Schéma fonctions ──────────────────────────────────────────────────────────
function FunctionsSchema() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label:'Tonique', degs:'I · III · VI', color:'border-orange-600 bg-orange-900/30', tc:'text-orange-300',
          desc:'Sensation de repos. La "maison". Le I est le plus stable de tous.' },
        { label:'Sous-dominante', degs:'II · IV', color:'border-blue-600 bg-blue-900/30', tc:'text-blue-300',
          desc:'Éloignement de la maison. Prépare la tension. Neutre, ni repos ni tension.' },
        { label:'Dominante', degs:'V · VII', color:'border-red-600 bg-red-900/30', tc:'text-red-300',
          desc:'Tension maximale. "Veut" revenir au repos. Le V7 est le plus fort.' },
      ].map(f => (
        <div key={f.label} className={`border rounded-xl p-3 ${f.color}`}>
          <p className={`font-bold text-sm ${f.tc}`}>{f.label}</p>
          <p className="text-gray-500 text-xs font-mono my-1">{f.degs}</p>
          <p className="text-gray-300 text-xs leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ── II-V-I schema ─────────────────────────────────────────────────────────────
function TwoFiveOneSchema() {
  return (
    <svg viewBox="0 0 580 130" className="w-full max-w-xl mx-auto" style={{ minWidth: 300 }}>
      <rect x={10} y={35} width={160} height={60} rx={12} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={2}/>
      <text x={90} y={58} textAnchor="middle" fontSize={10} fill="#93c5fd">II — Sous-dominante</text>
      <text x={90} y={82} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#3b82f6">Dm7</text>

      <line x1={175} y1={65} x2={215} y2={65} stroke="#6b7280" strokeWidth={2}/>
      <polygon points="215,65 206,60 206,70" fill="#6b7280"/>
      <text x={195} y={57} textAnchor="middle" fontSize={9} fill="#6b7280">tension↑</text>

      <rect x={220} y={35} width={160} height={60} rx={12} fill="#3b1c1c" stroke="#ef4444" strokeWidth={2}/>
      <text x={300} y={58} textAnchor="middle" fontSize={10} fill="#fca5a5">V — Dominante</text>
      <text x={300} y={82} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#ef4444">G7</text>

      <line x1={385} y1={65} x2={425} y2={65} stroke="#6b7280" strokeWidth={2}/>
      <polygon points="425,65 416,60 416,70" fill="#6b7280"/>
      <text x={405} y={57} textAnchor="middle" fontSize={9} fill="#6b7280">résolution↓</text>

      <rect x={430} y={35} width={140} height={60} rx={12} fill="#2d1f05" stroke="#f97316" strokeWidth={2.5}/>
      <text x={500} y={58} textAnchor="middle" fontSize={10} fill="#fdba74">I — Tonique</text>
      <text x={500} y={82} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#f97316">C△7</text>

      <text x={290} y={118} textAnchor="middle" fontSize={10} fill="#6b7280">en Do majeur</text>
    </svg>
  );
}

// ── Triton ────────────────────────────────────────────────────────────────────
function TritoneSchema() {
  const notes = ['G','Ab','A','Bb','B','C','Db','D','Eb','E','F','F#'];
  const cx = 200; const cy = 110; const r = 85;
  return (
    <svg viewBox="0 0 400 230" className="w-full max-w-xs mx-auto">
      <text x={cx} y={18} textAnchor="middle" fontSize={12} fill="#e5e7eb" fontWeight="bold">Le triton dans G7</text>
      {notes.map((n, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const isB = n === 'B'; const isF = n === 'F';
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={isB || isF ? 15 : 11}
              fill={isB ? '#991b1b' : isF ? '#1e3a8a' : '#1f2937'}
              stroke={isB || isF ? 'white' : '#374151'} strokeWidth={1.5}/>
            <text x={x} y={y + 4} textAnchor="middle" fontSize={isB || isF ? 10 : 8}
              fontWeight={isB || isF ? 'bold' : 'normal'} fill={isB || isF ? 'white' : '#9ca3af'}>{n}</text>
          </g>
        );
      })}
      {(() => {
        const aB = (notes.indexOf('B') / 12) * 2 * Math.PI - Math.PI / 2;
        const aF = (notes.indexOf('F') / 12) * 2 * Math.PI - Math.PI / 2;
        const x1 = cx + r * Math.cos(aB), y1 = cy + r * Math.sin(aB);
        const x2 = cx + r * Math.cos(aF), y2 = cy + r * Math.sin(aF);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth={2.5} strokeDasharray="5 3"/>;
      })()}
      <text x={cx} y={cy + 3} textAnchor="middle" fontSize={10} fill="#fbbf24" fontWeight="bold">6 demi-tons</text>
      <text x={cx} y={cy + 17} textAnchor="middle" fontSize={9} fill="#fbbf24">(= triton)</text>
      <text x={cx} y={200} textAnchor="middle" fontSize={10} fill="#ef4444">B (3e) monte → C</text>
      <text x={cx} y={215} textAnchor="middle" fontSize={10} fill="#3b82f6">F (b7) descend → E</text>
    </svg>
  );
}

// ── Tableau 12 tonalités ──────────────────────────────────────────────────────
const ALL_KEYS = [
  { key:'C',  ii:'Dm7',   v:'G7',   i:'C△7'  },
  { key:'F',  ii:'Gm7',   v:'C7',   i:'F△7'  },
  { key:'Bb', ii:'Cm7',   v:'F7',   i:'Bb△7' },
  { key:'Eb', ii:'Fm7',   v:'Bb7',  i:'Eb△7' },
  { key:'Ab', ii:'Bbm7',  v:'Eb7',  i:'Ab△7' },
  { key:'Db', ii:'Ebm7',  v:'Ab7',  i:'Db△7' },
  { key:'Gb', ii:'Abm7',  v:'Db7',  i:'Gb△7' },
  { key:'B',  ii:'C#m7',  v:'F#7',  i:'B△7'  },
  { key:'E',  ii:'F#m7',  v:'B7',   i:'E△7'  },
  { key:'A',  ii:'Bm7',   v:'E7',   i:'A△7'  },
  { key:'D',  ii:'Em7',   v:'A7',   i:'D△7'  },
  { key:'G',  ii:'Am7',   v:'D7',   i:'G△7'  },
];

export default function DeuxCinqUnPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* En-tête */}
        <div>
          <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Le II–V–I expliqué depuis zéro</h1>
          <p className="text-gray-400 mt-1">
            D'où vient cette progression ? Pourquoi ces trois accords précisément ? Tout part de la gamme majeure.
          </p>
        </div>

        {/* 1 - La gamme */}
        <Box title="Étape 1 — La gamme majeure : 7 notes, pas 12" accent="orange">
          <p className="text-gray-300 leading-relaxed">
            La <strong className="text-white">gamme de Do majeur</strong> utilise les 7 touches blanches du piano : C D E F G A B.
            Ce qui la définit, ce n'est pas les notes elles-mêmes, mais la <strong className="text-white">distance entre elles</strong>.
          </p>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Gamme de Do majeur — intervalles</p>
            <ScaleRow />
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-1">
            <p className="text-gray-400">La formule est toujours la même, quelle que soit la note de départ :</p>
            <p className="font-mono text-white">Ton – Ton – ½ ton – Ton – Ton – Ton – ½ ton</p>
            <p className="text-gray-500 text-xs mt-2">
              Ce patron de tons et demi-tons, c'est ce qui donne à la gamme majeure sa couleur caractéristique.
              Toute autre note de départ avec ce même patron donnera une gamme majeure, juste dans une autre tonalité.
            </p>
          </div>
        </Box>

        {/* 2 - Empiler des tierces */}
        <Box title="Étape 2 — Construire un accord : empiler des tierces" accent="blue">
          <p className="text-gray-300 leading-relaxed">
            Pour former un accord, on prend une note de la gamme et on <strong className="text-white">saute une note sur deux</strong> :
            on empile des <em>tierces</em>. Avec 4 notes empilées, on obtient un <strong className="text-white">accord de septième</strong>.
          </p>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-4">Exemple : accord sur le degré I (note C)</p>
            <div className="flex items-start gap-6 flex-wrap justify-center">
              <div className="text-sm space-y-2 text-gray-300">
                <p>On part de <strong className="text-white">C</strong></p>
                <p>On saute D → on prend <strong className="text-white">E</strong> (tierce)</p>
                <p>On saute F → on prend <strong className="text-white">G</strong> (quinte)</p>
                <p>On saute A → on prend <strong className="text-white">B</strong> (septième)</p>
                <p className="text-orange-300 font-semibold mt-3">Résultat : C – E – G – B = CMaj7</p>
              </div>
              <ChordBuild root="CMaj7" notes={['C','E','G','B']} quality="(1 – 3 – 5 – 7)" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Ce principe — sauter une note, prendre la suivante — s'applique à chacune des 7 notes de la gamme.
            On obtient ainsi <strong className="text-white">7 accords différents</strong>.
          </p>
        </Box>

        {/* 3 - L'harmonisation */}
        <Box title="Étape 3 — L'harmonisation : les 7 accords de la gamme" accent="blue">
          <p className="text-gray-300 leading-relaxed">
            En appliquant l'empilement de tierces à chaque note de Do majeur, on obtient cette table.
            C'est ce qu'on appelle <strong className="text-white">harmoniser la gamme</strong>.
          </p>
          <p className="text-gray-300 leading-relaxed text-sm">
            Remarque importante : on <em>reste dans la gamme</em> à chaque fois. On ne choisit pas les notes,
            elles sont imposées par la gamme. C'est pourquoi les accords n'ont pas tous la même qualité.
          </p>
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Harmonisation de Do majeur</p>
            <HarmoTable />
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-2">
            <p className="text-white font-semibold">Ce qu'on observe :</p>
            <ul className="space-y-1 text-gray-300">
              <li>• Les degrés <strong className="text-orange-300">I et IV</strong> donnent des accords <strong>majeur 7 (△7)</strong> — clairs, stables</li>
              <li>• Les degrés <strong className="text-blue-300">II, III et VI</strong> donnent des accords <strong>mineur 7 (m7)</strong> — doux, légèrement sombres</li>
              <li>• Le degré <strong className="text-red-300">V</strong> donne un accord <strong>dominant 7 (Dom7)</strong> — c'est le seul ! Il contient une tension unique</li>
              <li>• Le degré <strong className="text-purple-300">VII</strong> donne un accord <strong>demi-diminué (ø7)</strong> — instable, rare en dehors du contexte mineur</li>
            </ul>
          </div>
        </Box>

        {/* 4 - Les 3 fonctions */}
        <Box title="Étape 4 — Les 3 fonctions harmoniques" accent="orange">
          <p className="text-gray-300 leading-relaxed">
            En harmonie tonale, chaque accord a un <strong className="text-white">rôle</strong> dans la phrase musicale.
            Ces rôles se regroupent en <strong className="text-white">3 grandes fonctions</strong> :
          </p>
          <FunctionsSchema />
          <p className="text-gray-400 text-sm">
            Ce système de fonctions existe en musique classique depuis Bach. Le jazz l'a hérité directement.
            Toute musique tonale — pop, rock, classique, jazz — repose sur ce même principe.
          </p>
        </Box>

        {/* 5 - Extraction du II-V-I */}
        <Box title="Étape 5 — Le II–V–I : un représentant par fonction" accent="orange">
          <p className="text-gray-300 leading-relaxed">
            Le <strong className="text-white">II–V–I</strong> n'est pas une invention arbitraire.
            C'est la progression qui prend <strong className="text-white">l'accord le plus représentatif de chaque fonction</strong> :
          </p>
          <div className="bg-gray-900 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shrink-0">II</span>
              <div>
                <p className="text-blue-300 font-semibold">Dm7 — Sous-dominante</p>
                <p className="text-gray-400 text-sm">
                  Le IV (FMaj7) est aussi sous-dominante, mais le <strong className="text-white">IIm7 est préféré en jazz</strong>
                  car sa septième (C) est la note tonique — il crée un lien fort avec le I.
                  Il prépare le terrain sans forcer.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-red-700 text-white text-xs font-bold flex items-center justify-center shrink-0">V</span>
              <div>
                <p className="text-red-300 font-semibold">G7 — Dominante</p>
                <p className="text-gray-400 text-sm">
                  Le <strong className="text-white">seul accord dominant 7 naturel</strong> de la gamme majeure.
                  Il contient un intervalle explosif — le triton — qui crée une tension irrésistible vers le I.
                  C'est le moteur de toute la progression.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shrink-0">I</span>
              <div>
                <p className="text-orange-300 font-semibold">C△7 — Tonique</p>
                <p className="text-gray-400 text-sm">
                  La résolution, le repos. En jazz, on utilise le I△7 plutôt que le simple I
                  car la <strong className="text-white">septième majeure (B)</strong> ajoute une couleur lumineuse
                  caractéristique du jazz — c'est la "note jazz" par excellence.
                </p>
              </div>
            </div>
          </div>
          <TwoFiveOneSchema />
          <div className="bg-orange-900/20 border border-orange-700 rounded-xl p-4 text-sm">
            <p className="text-orange-300 font-semibold mb-1">Le point clé</p>
            <p className="text-gray-300">
              Le II–V–I n'est pas un choix stylistique du jazz. C'est la <strong className="text-white">progression naturelle
              de la gamme majeure</strong>, celle qui traverse les trois fonctions harmoniques dans l'ordre
              le plus logique : éloignement → tension → retour.
            </p>
          </div>
        </Box>

        {/* 6 - Le triton */}
        <Box title="Étape 6 — Pourquoi le V7 crée autant de tension : le triton" accent="red">
          <p className="text-gray-300 leading-relaxed">
            Dans G7 (G – B – D – F), les notes <strong className="text-red-300">B</strong> et <strong className="text-blue-300">F</strong> forment
            un <strong className="text-white">triton</strong> — exactement 6 demi-tons, la distance la plus instable
            de toute la musique occidentale. Cet intervalle est physiquement inconfortable à l'oreille.
          </p>
          <div className="flex flex-wrap gap-4 items-start justify-center">
            <TritoneSchema />
            <div className="space-y-3 text-sm max-w-xs">
              <div className="bg-gray-900 rounded-xl p-4 space-y-2">
                <p className="text-white font-semibold">Pourquoi ça se résout ?</p>
                <p className="text-gray-300">
                  Les deux notes du triton sont des <strong className="text-white">sensibles</strong> :
                  elles "veulent" bouger par demi-ton vers une note stable.
                </p>
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-red-900 border border-red-600 text-red-300 text-xs flex items-center justify-center font-bold">B</span>
                    <span className="text-gray-400 text-xs">tierce de G7 — monte d'un ½ ton →</span>
                    <span className="w-6 h-6 rounded bg-orange-900 border border-orange-600 text-orange-300 text-xs flex items-center justify-center font-bold">C</span>
                    <span className="text-gray-500 text-xs">(tonique)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-900 border border-blue-600 text-blue-300 text-xs flex items-center justify-center font-bold">F</span>
                    <span className="text-gray-400 text-xs">b7 de G7 — descend d'un ½ ton →</span>
                    <span className="w-6 h-6 rounded bg-orange-900 border border-orange-600 text-orange-300 text-xs flex items-center justify-center font-bold">E</span>
                    <span className="text-gray-500 text-xs">(tierce de C△7)</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-white font-semibold mb-2">Pourquoi le V7 est unique</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Dans la gamme majeure, le triton B–F n'apparaît <strong className="text-gray-200">qu'une seule fois</strong> :
                  dans l'accord de degré V. C'est pour cette raison que le V7 est l'accord le plus tendu
                  de la tonalité, et que sa résolution vers le I est si puissante.
                </p>
              </div>
            </div>
          </div>
        </Box>

        {/* 7 - En pratique */}
        <Box title="En pratique — Les notes en Do majeur" accent="orange">
          <p className="text-gray-400 text-sm">Jouez ces trois accords à la suite. Vous entendrez immédiatement la logique tension–résolution.</p>
          <div className="bg-gray-900 rounded-xl p-4 space-y-3">
            {[
              { chord:'Dm7',  notes:'D – F – A – C', role:'Éloignement',   color:'text-blue-300',   bg:'bg-blue-900/20 border-blue-700' },
              { chord:'G7',   notes:'G – B – D – F', role:'Tension',       color:'text-red-300',    bg:'bg-red-900/20 border-red-700' },
              { chord:'C△7',  notes:'C – E – G – B', role:'Résolution',    color:'text-orange-300', bg:'bg-orange-900/20 border-orange-700' },
            ].map(r => (
              <div key={r.chord} className={`flex items-center gap-4 border rounded-lg px-4 py-3 ${r.bg}`}>
                <span className={`text-xl font-bold w-12 shrink-0 ${r.color}`}>{r.chord}</span>
                <span className="font-mono text-xs text-gray-300 flex-1">{r.notes}</span>
                <span className={`text-xs font-semibold ${r.color}`}>{r.role}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-2">
            <p className="text-white font-semibold">À retenir sur les qualités d'accords</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div><strong className="text-gray-200">△7 (Maj7)</strong> — majeur 7e. Lumieux, stable. Ex : C△7 = C E G B</div>
              <div><strong className="text-gray-200">m7</strong> — mineur 7e. Doux, légèrement mélancolique. Ex : Dm7 = D F A C</div>
              <div><strong className="text-gray-200">7 (Dom7)</strong> — dominant. Tendu, instable. Ex : G7 = G B D F</div>
              <div><strong className="text-gray-200">ø7 (m7b5)</strong> — demi-diminué. Très instable. Ex : Bø7 = B D F A</div>
            </div>
          </div>
        </Box>

        {/* 8 - Mineur */}
        <Box title="Variante — Le II–V–I en tonalité mineure" accent="blue">
          <p className="text-gray-300 leading-relaxed text-sm">
            Quand on harmonise la <strong className="text-white">gamme mineure mélodique</strong> (utilisée en jazz pour les tonalités mineures),
            les accords changent de qualité. Le II–V–I mineur devient :
          </p>
          <div className="bg-gray-900 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-4 border rounded-lg px-4 py-3 bg-purple-900/20 border-purple-700">
              <span className="text-xl font-bold w-14 shrink-0 text-purple-300">Bø7</span>
              <div className="flex-1">
                <p className="text-xs text-gray-300 font-mono">B – D – F – A</p>
                <p className="text-[10px] text-gray-500">IIø7 — demi-diminué (m7b5)</p>
              </div>
              <span className="text-xs text-purple-300">Éloignement</span>
            </div>
            <div className="flex items-center gap-4 border rounded-lg px-4 py-3 bg-red-900/20 border-red-700">
              <span className="text-xl font-bold w-14 shrink-0 text-red-300">E7alt</span>
              <div className="flex-1">
                <p className="text-xs text-gray-300 font-mono">E – G# – B – D (+extensions altérées)</p>
                <p className="text-[10px] text-gray-500">V7 altéré — dominant avec tensions modifiées</p>
              </div>
              <span className="text-xs text-red-300">Tension</span>
            </div>
            <div className="flex items-center gap-4 border rounded-lg px-4 py-3 bg-teal-900/20 border-teal-700">
              <span className="text-xl font-bold w-14 shrink-0 text-teal-300">Am△7</span>
              <div className="flex-1">
                <p className="text-xs text-gray-300 font-mono">A – C – E – G#</p>
                <p className="text-[10px] text-gray-500">Im△7 — tonique mineure avec 7e majeure</p>
              </div>
              <span className="text-xs text-teal-300">Résolution</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Le V7 reste un dominant (même tension), mais ses extensions sont "altérées" (b9, #9, b5, #5) —
            ce qui lui donne une couleur plus sombre et plus jazzy. C'est une des couleurs les plus caractéristiques du bebop.
          </p>
        </Box>

        {/* 9 - 12 tonalités */}
        <Box title="Le II–V–I dans les 12 tonalités" accent="orange">
          <p className="text-gray-400 text-sm mb-3">
            Les standards de jazz changent souvent de tonalité au fil des mesures.
            Il faut reconnaître le II–V–I partout instantanément.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_KEYS.map(k => (
              <div key={k.key} className="bg-gray-900 rounded-lg px-3 py-2 border border-gray-700">
                <p className="text-gray-500 text-[10px] mb-1 uppercase tracking-wider">Ton. de {k.key}</p>
                <p className="font-mono text-xs">
                  <span className="text-blue-300">{k.ii}</span>
                  <span className="text-gray-600"> → </span>
                  <span className="text-red-300">{k.v}</span>
                  <span className="text-gray-600"> → </span>
                  <span className="text-orange-300">{k.i}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs">
            Astuce : le V est toujours une quinte au-dessus du I. Et le II est toujours une quarte au-dessus du V
            (ou une quinte en dessous). Une fois la logique intégrée, vous reconstruisez n'importe quel II–V–I de tête.
          </p>
        </Box>

        {/* 10 - Comment pratiquer */}
        <Box title="Comment pratiquer" accent="orange">
          <ol className="space-y-3 text-sm">
            {[
              { n:1, t:'Chantez la gamme',
                d:"Avant de toucher la guitare, chantez Do Ré Mi Fa Sol La Si Do. Puis montez et descendez. La gamme doit être dans votre tête, pas seulement dans vos doigts." },
              { n:2, t:'Construisez les accords de tête',
                d:"Prenez n'importe quelle note (par exemple F). Empilez des tierces en restant dans la gamme de F majeur. Quel accord obtenez-vous sur le degré II ? Le V ? Le I ?" },
              { n:3, t:"Jouez le II–V–I en C d'abord",
                d:"Dm7 → G7 → C△7. Arpégez chaque accord dans la même position du manche. Utilisez le bouton ▶ pour entendre l'accompagnement et jouer par-dessus." },
              { n:4, t:'Repérez le triton dans G7',
                d:"Trouvez B et F dans l'accord G7. Jouez-les ensemble, écoutez la tension. Puis résolvez : B→C et F→E. Ce mouvement de demi-ton est au cœur du jazz." },
              { n:5, t:'Transposez dans toutes les tonalités',
                d:"Utilisez les boutons ‹ › dans le visualiseur. Jouez le même II–V–I dans les 12 tonalités. Les standards vous demanderont toutes." },
              { n:6, t:'Standards pour commencer',
                d:"Autumn Leaves (Sol mineur), All The Things You Are (Fa majeur), Blue Bossa (Do mineur) — tous basés sur des enchaînements de II–V–I. Identifiez chaque cadence avant de jouer." },
            ].map(s => (
              <li key={s.n} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                <div>
                  <p className="font-semibold text-white">{s.t}</p>
                  <p className="text-gray-400 mt-0.5">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Box>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Pratiquer dans le visualiseur →
          </Link>
          <Link href="/tuto/gammes"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Les gammes
          </Link>
          <Link href="/tuto/standard"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Autumn Leaves →
          </Link>
        </div>

      </div>
    </main>
  );
}
