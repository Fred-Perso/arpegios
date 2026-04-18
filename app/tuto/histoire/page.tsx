import Link from 'next/link';

const STYLES = [
  {
    era: '1890–1920',
    name: 'New Orleans Jazz & Ragtime',
    color: 'border-amber-600 bg-amber-900/20',
    badge: 'bg-amber-700',
    icon: '🎺',
    desc: "Le jazz naît à la Nouvelle-Orléans, à l'intersection des blues afro-américains, du ragtime syncopé et des harmonies européennes. C'est une musique de rue, de fête, de deuil et d'espoir.",
    harmony: "Accords simples I–IV–V. Blues pentatonique. Pas encore de septièmes systematiques.",
    rhythm: "Syncope, swing embryonnaire, polyrythmie africaine. La section rythmique tuba/banjo.",
    key: ['Louis Armstrong', 'Jelly Roll Morton', 'King Oliver', 'Sidney Bechet'],
    pieces: ['St. James Infirmary', 'When The Saints Go Marching In', 'Maple Leaf Rag'],
    what: "La naissance du langage : blues + Europe + Afrique = une nouvelle musique.",
  },
  {
    era: '1930–1945',
    name: 'Swing & Big Band',
    color: 'border-yellow-600 bg-yellow-900/20',
    badge: 'bg-yellow-700',
    icon: '🎷',
    desc: "Le jazz devient populaire. Les grands orchestres (big bands) jouent pour danser. C'est l'âge d'or de la musique populaire américaine — l'équivalent de la pop d'aujourd'hui.",
    harmony: "Accords de 7e généralisés. Tensions 9e, 11e, 13e introduites progressivement.",
    rhythm: "Swing feel établi. 4/4 walking bass. Batterie en rôle central. Soliste en avant-plan.",
    key: ['Duke Ellington', 'Count Basie', 'Benny Goodman', 'Billie Holiday', 'Django Reinhardt'],
    pieces: ['Take the A Train', 'In The Mood', 'Sing Sing Sing', "Nuages"],
    what: "La sophistication harmonique : les accords prennent de la couleur et de la hauteur.",
  },
  {
    era: '1945–1955',
    name: 'Bebop',
    color: 'border-red-600 bg-red-900/20',
    badge: 'bg-red-700',
    icon: '🎸',
    desc: "Révolution. Le bebop rejette la danse pour l'art. Tempos fulgurants, harmonies complexes, phrases longues et sinueuses. C'est la naissance du jazz comme musique savante.",
    harmony: "II–V–I omniprésents. Substitutions de tritons. Altérations (b9, #11, b13). Accords de passage.",
    rhythm: "Tempos rapides (200–300 BPM). Ride cymbal pattern. Basse walking permanente.",
    key: ['Charlie Parker', 'Dizzy Gillespie', 'Thelonious Monk', 'Bud Powell', 'Kenny Clarke'],
    pieces: ["Anthropology", "Donna Lee", "Round Midnight", "A Night in Tunisia"],
    what: "La grammaire complète : II–V–I, substitutions, chromatisme. C'est ici que tout se joue.",
  },
  {
    era: '1955–1965',
    name: 'Hard Bop & Cool Jazz',
    color: 'border-blue-600 bg-blue-900/20',
    badge: 'bg-blue-700',
    icon: '🎹',
    desc: "Deux directions opposées. Le hard bop renoue avec les racines blues et gospel (Art Blakey). Le cool jazz cherche la légèreté, la nuance, l'influence classique (Miles Davis, 1949–1950).",
    harmony: "Harmonies bebop maîtrisées. Introduction des modes grecs (dorien, lydien...). Couleurs modales.",
    rhythm: "Hard bop : groove puissant, influences R&B. Cool : légèreté, nuances dynamiques.",
    key: ['Miles Davis', 'John Coltrane', 'Art Blakey', 'Clifford Brown', 'Dave Brubeck'],
    pieces: ['Moanin\'', 'Blue Train', 'Take Five', 'Waltz for Debby'],
    what: "La bifurcation : les racines (blues/gospel) vs l'expansion harmonique (modes).",
  },
  {
    era: '1959–1970',
    name: 'Jazz Modal',
    color: 'border-teal-600 bg-teal-900/20',
    badge: 'bg-teal-700',
    icon: '🌊',
    desc: "\"Kind of Blue\" de Miles Davis (1959) change tout. On abandonne les changements d'accords rapides pour s'attarder sur une seule sonorité, un mode. L'improvisation devient méditation.",
    harmony: "Un accord = plusieurs mesures. Modes : dorien (Dm7), lydien (F△7), mixolydien (G7). Couleurs statiques.",
    rhythm: "Tempo souple, \"floating\" feel. Piano moins chargé harmoniquement (comping minimaliste).",
    key: ['Miles Davis', 'John Coltrane', 'Bill Evans', 'Wayne Shorter', 'Herbie Hancock'],
    pieces: ["So What", "Impressions", "Maiden Voyage", "Footprints"],
    what: "La libération de la forme : ne plus naviguer des accords, mais habiter une couleur.",
  },
  {
    era: '1965–1975',
    name: "Free Jazz & Fusion",
    color: 'border-purple-600 bg-purple-900/20',
    badge: 'bg-purple-700',
    icon: '⚡',
    desc: "Deux explosions simultanées. Ornette Coleman libère la musique de toute structure harmonique. Miles Davis électrifie avec \"Bitches Brew\" (1970), fusionnant jazz et rock.",
    harmony: "Free jazz : atonalité, structures libres. Fusion : harmonies rock, pédales, riffs.",
    rhythm: "Free : métrique abolie. Fusion : groove lourd, influences funk/rock, basse électrique.",
    key: ['Ornette Coleman', 'Miles Davis', 'Mahavishnu Orchestra', 'Weather Report', 'Herbie Hancock'],
    pieces: ["Free Jazz", "Bitches Brew", "Birdland", "Teen Town"],
    what: "La rupture et la greffe : le jazz se questionne et absorbe le monde extérieur.",
  },
  {
    era: '1980–2000',
    name: 'Post-Bop & Jazz Contemporain',
    color: 'border-green-600 bg-green-900/20',
    badge: 'bg-green-700',
    icon: '🎼',
    desc: "Retour aux sources avec Wynton Marsalis et la scène de Harlem. Mais aussi explosion du jazz européen, scandinave, latin. Le jazz mondial se diversifie infiniment.",
    harmony: "Synthèse de toutes les périodes. Influences classiques contemporaines (Steve Coleman, M-Base). Jazz latin complexe.",
    rhythm: "Mélange de styles, polyrhythmie, influences du monde. ECM Records : esthétique nordique.",
    key: ['Wynton Marsalis', 'Pat Metheny', 'Keith Jarrett', 'Steve Coleman', 'John Scofield'],
    pieces: ["Autumn Leaves (nouvelle lecture)", "Bright Size Life", "The Köln Concert"],
    what: "L'héritage vivant : tout coexiste, rien n'est mort, tout se réinvente.",
  },
  {
    era: '2000–aujourd\'hui',
    name: 'Jazz du XXIe siècle',
    color: 'border-pink-600 bg-pink-900/20',
    badge: 'bg-pink-700',
    icon: '🌐',
    desc: "Le jazz absorbe le hip-hop, la électro, la world music. Kamasi Washington rend le jazz populaire sur Spotify. Snarky Puppy invente un collectif jazz-funk-pop. Le jazz se raconte aussi sur Instagram.",
    harmony: "Harmonies néo-soul (9e, 11e, 13e sur tout). Samples. Looping. Accords quartal (Herbie style).",
    rhythm: "Groove hip-hop, trap jazz (Robert Glasper), afrobeat, influences brésiliennes.",
    key: ['Kamasi Washington', 'Robert Glasper', 'Snarky Puppy', 'Esperanza Spalding', 'Brad Mehldau'],
    pieces: ["The Epic", "Afro Blue", "Lingus", "Overjoyed"],
    what: "Le jazz comme langage universel qui traverse toutes les cultures et générations.",
  },
];

export default function HistoirePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">L'évolution du jazz</h1>
          <p className="text-gray-400 mt-1">130 ans d'une musique qui n'a jamais cessé de se réinventer</p>
        </div>

        {/* Timeline intro */}
        <div className="bg-gray-800 rounded-2xl p-5">
          <p className="text-gray-300 leading-relaxed">
            Le jazz n'est pas une musique figée. C'est un <strong className="text-white">organisme vivant</strong> qui a
            traversé des révolutions, des crises, des renaissances. Comprendre son histoire,
            c'est comprendre <em>pourquoi</em> les musiciens jouent ce qu'ils jouent aujourd'hui — et
            d'où vient chaque couleur harmonique que vous utilisez dans le visualiseur.
          </p>
        </div>

        {/* Styles timeline */}
        <div className="space-y-4">
          {STYLES.map((s, i) => (
            <div key={i} className={`border rounded-2xl p-5 space-y-3 ${s.color}`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${s.badge}`}>{s.era}</span>
                    <h2 className="text-lg font-bold text-white">{s.name}</h2>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-900/60 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Harmonie</p>
                  <p className="text-gray-300">{s.harmony}</p>
                </div>
                <div className="bg-gray-900/60 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rythme</p>
                  <p className="text-gray-300">{s.rhythm}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Figures clés</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.key.map(m => (
                      <span key={m} className="text-xs bg-gray-900/60 text-gray-300 rounded px-2 py-0.5">{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">À écouter absolument</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.pieces.map(p => (
                    <span key={p} className="text-xs italic text-gray-400 bg-gray-900/40 rounded px-2 py-0.5">"{p}"</span>
                  ))}
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-2.5">
                <p className="text-xs text-white/70"><strong className="text-white">Ce que ça apporte :</strong> {s.what}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-xl font-bold">Le fil conducteur</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            À travers toutes ces révolutions, <strong className="text-white">un invariant</strong> : la
            conversation entre musiciens, l'improvisation comme acte de liberté, et la tension entre
            <em> tradition et innovation</em>. Chaque génération a à la fois respecté et cassé ce qui
            précédait — c'est cela, le jazz.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Les arpèges que vous apprenez ici sont l'héritage direct du bebop (1945). En les maîtrisant,
            vous accédez au vocabulaire de Parker, Coltrane, Monk — et vous pouvez vous projeter
            vers n'importe quelle direction contemporaine.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto/variete"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Je viens de la variété →
          </Link>
          <Link href="/tuto"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Accueil théorie
          </Link>
        </div>
      </div>
    </main>
  );
}
