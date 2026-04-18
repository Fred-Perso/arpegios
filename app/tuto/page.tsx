import Link from 'next/link';

const MAJOR_DEGREES = [
  { deg: 'I',   chord: 'Maj7',  symbol: '△7',  notes: '1 – 3 – 5 – 7',      color: 'text-amber-300',  example: 'C△7'  },
  { deg: 'II',  chord: 'm7',    symbol: 'm7',  notes: '1 – b3 – 5 – b7',    color: 'text-blue-300',   example: 'Dm7'  },
  { deg: 'III', chord: 'm7',    symbol: 'm7',  notes: '1 – b3 – 5 – b7',    color: 'text-blue-300',   example: 'Em7'  },
  { deg: 'IV',  chord: 'Maj7',  symbol: '△7',  notes: '1 – 3 – 5 – 7',      color: 'text-amber-300',  example: 'F△7'  },
  { deg: 'V',   chord: 'Dom7',  symbol: '7',   notes: '1 – 3 – 5 – b7',     color: 'text-red-300',    example: 'G7'   },
  { deg: 'VI',  chord: 'm7',    symbol: 'm7',  notes: '1 – b3 – 5 – b7',    color: 'text-blue-300',   example: 'Am7'  },
  { deg: 'VII', chord: 'm7b5',  symbol: 'ø7',  notes: '1 – b3 – b5 – b7',   color: 'text-purple-300', example: 'Bø7'  },
];

const MELO_MINOR_DEGREES = [
  { deg: 'I',   chord: 'mMaj7',   symbol: 'm△7',   notes: '1 – b3 – 5 – 7',    color: 'text-teal-300',   example: 'Cm△7' },
  { deg: 'II',  chord: 'm7',      symbol: 'm7',    notes: '1 – b3 – 5 – b7',   color: 'text-blue-300',   example: 'Dm7'  },
  { deg: 'III', chord: 'Maj7#5',  symbol: '△7#5',  notes: '1 – 3 – #5 – 7',    color: 'text-cyan-300',   example: 'Eb△7#5'},
  { deg: 'IV',  chord: 'Dom7',    symbol: '7',     notes: '1 – 3 – 5 – b7',    color: 'text-red-300',    example: 'F7'   },
  { deg: 'V',   chord: 'Dom7',    symbol: '7',     notes: '1 – 3 – 5 – b7',    color: 'text-red-300',    example: 'G7'   },
  { deg: 'VI',  chord: 'm7b5',    symbol: 'ø7',    notes: '1 – b3 – b5 – b7',  color: 'text-purple-300', example: 'Aø7'  },
  { deg: 'VII', chord: 'dim7',    symbol: 'o7',    notes: '1 – b3 – b5 – bb7', color: 'text-rose-300',   example: 'Bo7'  },
];

function Table({ rows }: { rows: typeof MAJOR_DEGREES }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
            <th className="text-left py-2 pr-4">Degré</th>
            <th className="text-left py-2 pr-4">Type</th>
            <th className="text-left py-2 pr-4">Intervalles</th>
            <th className="text-left py-2">En Do</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {rows.map(r => (
            <tr key={r.deg}>
              <td className="py-2.5 pr-4 font-bold text-white">{r.deg}</td>
              <td className={`py-2.5 pr-4 font-semibold ${r.color}`}>{r.chord} <span className="opacity-60">{r.symbol}</span></td>
              <td className="py-2.5 pr-4 text-gray-300 font-mono text-xs">{r.notes}</td>
              <td className={`py-2.5 font-semibold ${r.color}`}>{r.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-gray-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

export default function TutoPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Théorie des arpèges à 4 sons</h1>
          <p className="text-gray-400 mt-1">Construction sur la gamme majeure et la gamme mineure mélodique</p>
        </div>

        <Section title="Qu'est-ce qu'un arpège à 4 sons ?">
          <p className="text-gray-300 leading-relaxed">
            Un arpège à 4 sons est la version mélodique d'un accord de 7e — on joue les 4 notes séparément,
            de bas en haut (ou l'inverse). En jazz, on les utilise pour improviser en suivant les accords de la grille.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Il se construit en empilant des <span className="text-white font-medium">tierces</span> à partir
            d'une note racine : racine → tierce → quinte → septième. Selon le type de tierce (majeure ou mineure),
            on obtient différentes qualités d'accords.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-300">
            <p>Cmaj7 : C – E – G – B  (1 – 3 – 5 – △7)</p>
            <p>Dm7   : D – F – A – C  (1 – b3 – 5 – b7)</p>
            <p>G7    : G – B – D – F  (1 – 3 – 5 – b7)</p>
          </div>
        </Section>

        <Section title="Les 4 types d'arpèges fondamentaux">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Major 7',    sym: '△7',  intervals: '1  3  5  △7',  color: 'border-amber-700  bg-amber-900/30 text-amber-200',  desc: 'Accord stable, couleur lumineuse. Degrés I et IV.' },
              { name: 'Minor 7',    sym: 'm7',  intervals: '1  b3  5  b7', color: 'border-blue-700   bg-blue-900/30  text-blue-200',   desc: 'Accord mineur doux. Degrés II, III et VI.' },
              { name: 'Dominant 7', sym: '7',   intervals: '1  3  5  b7',  color: 'border-red-700    bg-red-900/30   text-red-200',    desc: 'Tension maximale, résout sur le I. Degré V.' },
              { name: 'Min7b5',     sym: 'ø7',  intervals: '1  b3  b5  b7',color: 'border-purple-700 bg-purple-900/30 text-purple-200', desc: 'Semi-diminué. Degré VII, couleur sombre.' },
            ].map(t => (
              <div key={t.sym} className={`border rounded-xl p-4 ${t.color}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-white">{t.name}</span>
                  <span className="text-lg font-semibold">{t.sym}</span>
                </div>
                <p className="font-mono text-xs mb-2 opacity-80">{t.intervals}</p>
                <p className="text-xs opacity-70">{t.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Harmonie de la gamme majeure">
          <p className="text-gray-300 text-sm leading-relaxed">
            En empilant des tierces de la gamme majeure sur chaque degré, on obtient 7 accords de 7e.
            <strong className="text-white"> Exemple en Do majeur :</strong>
          </p>
          <Table rows={MAJOR_DEGREES} />
          <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-300 mt-2">
            <p className="font-medium text-white mb-1">Moyen mnémotechnique :</p>
            <p className="font-mono">I△7 – IIm7 – IIIm7 – IV△7 – V7 – VIm7 – VIIø7</p>
            <p className="text-xs text-gray-400 mt-1">Le seul accord dominant (V7) crée la tension qui résout sur le I.</p>
          </div>
        </Section>

        <Section title="Harmonie de la gamme mineure mélodique">
          <p className="text-gray-300 text-sm leading-relaxed">
            La gamme mineure mélodique (ascendante) diffère de la gamme majeure uniquement par la tierce bémolisée (b3).
            Elle génère des couleurs harmoniques très utilisées en jazz moderne.
            <strong className="text-white"> Exemple en Do min. mélodique :</strong>
          </p>
          <Table rows={MELO_MINOR_DEGREES} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {[
              { deg: 'I — m△7',   desc: 'Chord "over" un accord mineur stable. Très utilisé sur Im dans une cadence modale.' },
              { deg: 'IV — Dom7 (Lydien dominant)', desc: 'Dom7 avec #4, couleur lydienne. Typique du style bebop et jazz fusion.' },
              { deg: 'VII — dim7', desc: 'Arpège symétrique (intervalles de tierces mineures). Substitut du V7b9.' },
            ].map(t => (
              <div key={t.deg} className="bg-gray-900 rounded-xl p-3 text-xs">
                <p className="font-semibold text-white mb-1">{t.deg}</p>
                <p className="text-gray-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Comment pratiquer sur le manche ?">
          <ol className="space-y-3 text-gray-300 text-sm">
            {[
              { n: 1, title: 'Une position à la fois', desc: "Commencez par apprendre l'arpège dans une seule position (Pos. 1). Montée et descente, en boucle, avec le métronome." },
              { n: 2, title: 'Liez les 5 positions', desc: "Enchaînez Pos. 1 → 2 → 3 → 4 → 5 sur tout le manche sans interruption. C'est la clé pour ne plus être bloqué dans une zone." },
              { n: 3, title: 'Changement de degrés', desc: "Jouez le II–V–I : IIm7 → V7 → I△7 dans la même zone du manche. Ex. en C : Dm7 → G7 → C△7." },
              { n: 4, title: 'Transposez dans toutes les tonalités', desc: "Utilisez le sélecteur de tonalité (‹ ›) pour vous entraîner sur tous les 12 demi-tons. Les formes restent identiques, seule la position change." },
              { n: 5, title: 'Ajoutez le rythme', desc: "Utilisez le bouton ▶ pour entendre la sonorité de l'arpège et adapter votre touché." },
            ].map(s => (
              <li key={s.n} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-white">{s.title}</p>
                  <p className="text-gray-400 mt-0.5">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <div className="text-center">
          <Link href="/"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            ← Ouvrir le visualiseur
          </Link>
        </div>

      </div>
    </main>
  );
}
