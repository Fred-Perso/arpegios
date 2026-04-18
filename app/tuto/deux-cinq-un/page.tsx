import Link from 'next/link';

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-gray-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

// Animated II-V-I flow diagram
function TwoFiveOneSchema({ keyNote = 'C', ii = 'Dm7', v = 'G7', i = 'C△7' }) {
  return (
    <svg viewBox="0 0 600 140" className="w-full max-w-xl mx-auto" style={{ minWidth: 300 }}>
      {/* Arrow background track */}
      <path d="M30 70 Q300 10 570 70" stroke="#374151" strokeWidth={3} fill="none" strokeDasharray="4 3" />

      {/* II chord */}
      <rect x={20} y={44} width={120} height={52} rx={12} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={2}/>
      <text x={80} y={65} textAnchor="middle" fontSize={11} fill="#93c5fd">II — Sous-dominante</text>
      <text x={80} y={84} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#3b82f6">{ii}</text>

      {/* Arrow II→V */}
      <line x1={145} y1={70} x2={205} y2={70} stroke="#6b7280" strokeWidth={2}/>
      <polygon points="205,70 196,65 196,75" fill="#6b7280"/>
      <text x={175} y={62} textAnchor="middle" fontSize={9} fill="#6b7280">tension ↑</text>

      {/* V chord */}
      <rect x={210} y={44} width={120} height={52} rx={12} fill="#3b1c1c" stroke="#ef4444" strokeWidth={2}/>
      <text x={270} y={65} textAnchor="middle" fontSize={11} fill="#fca5a5">V — Dominante</text>
      <text x={270} y={84} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#ef4444">{v}</text>

      {/* Arrow V→I */}
      <line x1={335} y1={70} x2={395} y2={70} stroke="#6b7280" strokeWidth={2}/>
      <polygon points="395,70 386,65 386,75" fill="#6b7280"/>
      <text x={365} y={62} textAnchor="middle" fontSize={9} fill="#6b7280">résolution ↓</text>

      {/* I chord */}
      <rect x={400} y={44} width={120} height={52} rx={12} fill="#2d1f05" stroke="#f97316" strokeWidth={2.5}/>
      <text x={460} y={65} textAnchor="middle" fontSize={11} fill="#fdba74">I — Tonique</text>
      <text x={460} y={84} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#f97316">{i}</text>

      {/* Key label */}
      <text x={300} y={128} textAnchor="middle" fontSize={11} fill="#6b7280">Tonalité de {keyNote} majeur</text>
    </svg>
  );
}

// Tritone explanation
function TritoneSchema() {
  const notes = ['G','Ab','A','Bb','B','C','Db','D','Eb','E','F','F#'];
  const W = 480; const cx = 240; const cy = 100; const r = 80;
  return (
    <svg viewBox="0 0 480 210" className="w-full max-w-sm mx-auto">
      <text x={cx} y={20} textAnchor="middle" fontSize={12} fill="#e5e7eb" fontWeight="bold">Le triton de G7</text>
      {notes.map((n, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        const isKey = n === 'B' || n === 'F';
        return (
          <g key={n}>
            <circle cx={x} cy={y2} r={isKey ? 14 : 10}
              fill={isKey ? (n === 'B' ? '#ef4444' : '#3b82f6') : '#1f2937'}
              stroke={isKey ? 'white' : '#374151'} strokeWidth={1.5}/>
            <text x={x} y={y2 + 4} textAnchor="middle" fontSize={isKey ? 9 : 8}
              fontWeight={isKey ? 'bold' : 'normal'} fill={isKey ? 'white' : '#9ca3af'}>{n}</text>
          </g>
        );
      })}
      {/* Tritone line */}
      {(() => {
        const aB = (notes.indexOf('B') / 12) * 2 * Math.PI - Math.PI / 2;
        const aF = (notes.indexOf('F') / 12) * 2 * Math.PI - Math.PI / 2;
        const x1 = cx + r * Math.cos(aB), y1 = cy + r * Math.sin(aB);
        const x2 = cx + r * Math.cos(aF), y2 = cy + r * Math.sin(aF);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth={2.5} strokeDasharray="4 2"/>;
      })()}
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={10} fill="#fbbf24" fontWeight="bold">Triton</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize={9} fill="#fbbf24">B – F = 6 demi-tons</text>
      <text x={cx} y={195} textAnchor="middle" fontSize={10} fill="#9ca3af">
        Le B (3) veut monter → C. Le F (b7) veut descendre → E.
      </text>
    </svg>
  );
}

const ALL_KEYS_251 = [
  { key:'C',  ii:'Dm7',   v:'G7',    i:'C△7'  },
  { key:'F',  ii:'Gm7',   v:'C7',    i:'F△7'  },
  { key:'Bb', ii:'Cm7',   v:'F7',    i:'Bb△7' },
  { key:'Eb', ii:'Fm7',   v:'Bb7',   i:'Eb△7' },
  { key:'Ab', ii:'Bbm7',  v:'Eb7',   i:'Ab△7' },
  { key:'Db', ii:'Ebm7',  v:'Ab7',   i:'Db△7' },
  { key:'Gb', ii:'Abm7',  v:'Db7',   i:'Gb△7' },
  { key:'B',  ii:'C#m7',  v:'F#7',   i:'B△7'  },
  { key:'E',  ii:'F#m7',  v:'B7',    i:'E△7'  },
  { key:'A',  ii:'Bm7',   v:'E7',    i:'A△7'  },
  { key:'D',  ii:'Em7',   v:'A7',    i:'D△7'  },
  { key:'G',  ii:'Am7',   v:'D7',    i:'G△7'  },
];

export default function DeuxCinqUnPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Le II–V–I pour les nuls</h1>
          <p className="text-gray-400 mt-1">La progression harmonique centrale du jazz — expliquée simplement</p>
        </div>

        <Box title="C'est quoi le II–V–I ?">
          <p className="text-gray-300 leading-relaxed">
            Le <strong className="text-white">II–V–I</strong> (on dit "deux-cinq-un") est la progression d'accords
            la plus utilisée en jazz. Elle se retrouve dans pratiquement tous les standards. C'est le moteur de la musique jazz.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Elle utilise trois accords de la gamme majeure — les degrés <strong className="text-white">II, V et I</strong> —
            qui créent une sensation de <em>départ → tension → retour au calme</em>.
          </p>
          <TwoFiveOneSchema />
        </Box>

        <Box title="Le rôle de chaque accord">
          <div className="space-y-3">
            {[
              {
                deg: 'II — Sous-dominante',
                chord: 'IIm7', color: 'border-blue-600 bg-blue-900/30',
                textColor: 'text-blue-300',
                desc: "Le IIm7 prépare le terrain. C'est l'accord qui éloigne de la tonique. En C majeur c'est Dm7 (Ré mineur 7). Seul, il sonne stable. En séquence, il crée une attente.",
                intervals: '1 – b3 – 5 – b7',
              },
              {
                deg: 'V — Dominante',
                chord: 'V7', color: 'border-red-600 bg-red-900/30',
                textColor: 'text-red-300',
                desc: "Le V7 crée la tension maximale. En C majeur c'est G7. Il contient un intervalle explosif : le triton (B–F), qui \"veut\" se résoudre. C'est lui qui donne l'énergie au jazz.",
                intervals: '1 – 3 – 5 – b7',
              },
              {
                deg: 'I — Tonique',
                chord: 'I△7', color: 'border-orange-600 bg-orange-900/30',
                textColor: 'text-orange-300',
                desc: "Le I△7 est la résolution, le repos. En C majeur c'est C△7. Après la tension du V7, arriver sur le I△7 donne une sensation de soulagement. C'est \"rentrer à la maison\".",
                intervals: '1 – 3 – 5 – △7',
              },
            ].map(a => (
              <div key={a.deg} className={`border rounded-xl p-4 ${a.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xl font-bold ${a.textColor}`}>{a.chord}</span>
                  <span className="text-gray-300 font-semibold">{a.deg}</span>
                  <span className={`font-mono text-xs ${a.textColor} opacity-70`}>{a.intervals}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </Box>

        <Box title="Pourquoi ça fonctionne ? Le triton">
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Le secret du II–V–I est dans l'accord V7. Il contient un intervalle de <strong className="text-white">triton</strong> (6 demi-tons)
            entre sa tierce (3) et sa septième (b7). Ces deux notes créent une tension qui se résout naturellement :
          </p>
          <TritoneSchema />
          <div className="bg-gray-900 rounded-xl p-4 text-sm">
            <p className="text-white font-semibold mb-2">Dans G7 → C△7 :</p>
            <p className="text-gray-300">• La <span className="text-red-300 font-semibold">tierce B</span> (sensible) monte d'un demi-ton → <strong className="text-orange-300">C</strong> (tonique)</p>
            <p className="text-gray-300">• La <span className="text-blue-300 font-semibold">b7 F</span> descend d'un demi-ton → <strong className="text-orange-300">E</strong> (tierce de C△7)</p>
          </div>
        </Box>

        <Box title="Exemple pratique en C majeur">
          <div className="bg-gray-900 rounded-xl p-4 space-y-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Arpèges à jouer (avec le visualiseur)</p>
            {[
              { step: '1. Départ',    chord: 'Dm7',  notes: 'D – F – A – C', color: 'text-blue-300',   bars: '2 mesures'},
              { step: '2. Tension',  chord: 'G7',   notes: 'G – B – D – F', color: 'text-red-300',    bars: '2 mesures'},
              { step: '3. Résolution',chord: 'C△7', notes: 'C – E – G – B', color: 'text-orange-300', bars: '4 mesures'},
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3">
                <span className="text-gray-500 text-xs w-28 shrink-0">{s.step}</span>
                <span className={`font-bold text-lg w-16 shrink-0 ${s.color}`}>{s.chord}</span>
                <span className="font-mono text-xs text-gray-400 flex-1">{s.notes}</span>
                <span className="text-gray-600 text-xs">{s.bars}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            👉 Dans le visualiseur : tonalité <strong className="text-white">C</strong>,
            jouez <strong className="text-blue-300">II (Dm7)</strong> → <strong className="text-red-300">V (G7)</strong> → <strong className="text-orange-300">I (C△7)</strong>.
          </p>
        </Box>

        <Box title="Le II–V–I dans les 12 tonalités">
          <p className="text-gray-400 text-sm mb-3">Il faut le connaître dans toutes les tonalités — les standards de jazz changent souvent de tonalité !</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {ALL_KEYS_251.map(k => (
              <div key={k.key} className="bg-gray-900 rounded-lg px-3 py-2">
                <p className="text-gray-500 text-xs mb-1">Tonalité de {k.key}</p>
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
        </Box>

        <Box title="Variations : le II–V–I mineur">
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            En tonalité mineure (issue de la gamme mineure mélodique), le II–V–I devient :
            <strong className="text-white"> IIø7 → V7alt → Im△7</strong>
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm space-y-1">
            <p className="text-gray-400">Exemple en La mineur :</p>
            <p>
              <span className="text-purple-300">Bø7</span>
              <span className="text-gray-600"> (IIø7) → </span>
              <span className="text-red-300">E7</span>
              <span className="text-gray-600"> (V7) → </span>
              <span className="text-teal-300">Am△7</span>
              <span className="text-gray-600"> (Im△7)</span>
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            Activez <strong className="text-white">Min. mélodique</strong> dans le visualiseur pour explorer ces couleurs.
          </p>
        </Box>

        <Box title="Comment pratiquer le II–V–I ?">
          <ol className="space-y-3 text-sm">
            {[
              { n:1, t:'Apprenez la cadence en C',        d:"Commencez par Dm7 → G7 → C△7. Jouez l'arpège de chaque accord dans la même zone du manche. Utilisez le bouton ▶ pour entendre le son." },
              { n:2, t:'Connectez les positions',          d:'Essayez de lier les 3 arpèges sans déplacer beaucoup la main. Cherchez les notes communes entre les accords (ex: F est dans Dm7 et G7).' },
              { n:3, t:'Transposez',                       d:"Utilisez les boutons ‹ › pour changer la tonalité. Jouez le même enchaînement II–V–I dans toutes les 12 tonalités." },
              { n:4, t:'Ajoutez du rythme',                d:"Ne jouez pas les notes mécaniquement. Essayez des rythmes syncopés, des triolets, des swings. C'est là que le jazz commence." },
              { n:5, t:'Standards de jazz à connaître',    d:"Autumn Leaves, All The Things You Are, Blue Bossa, Fly Me To The Moon — tous basés sur le II–V–I. Identifiez ces cadences dans la partition." },
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

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Pratiquer dans le visualiseur →
          </Link>
          <Link href="/tuto/intervalles"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Cours intervalles
          </Link>
        </div>
      </div>
    </main>
  );
}
