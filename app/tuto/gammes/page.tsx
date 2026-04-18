import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

function ScaleRow({ name, formula, notes, color }: { name: string; formula: string; notes: string; color: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <div className="flex flex-wrap items-baseline gap-2 mb-1">
        <span className={`font-bold text-base ${color}`}>{name}</span>
        <span className="font-mono text-xs text-gray-500">{formula}</span>
      </div>
      <p className="font-mono text-sm text-gray-300">{notes}</p>
    </div>
  );
}

function ScaleSVG({ intervals, name }: { intervals: number[]; name: string }) {
  const W = 560; const H = 80;
  const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const cellW = W / 12;
  const active = new Set<number>();
  let pos = 0;
  active.add(0);
  for (const iv of intervals) { pos += iv; if (pos <= 12) active.add(pos % 12); }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto">
      {notes.map((n, i) => {
        const x = i * cellW + cellW / 2;
        const isActive = active.has(i);
        return (
          <g key={i}>
            <circle cx={x} cy={36} r={14} fill={isActive ? '#f97316' : '#1f2937'} stroke={isActive ? 'white' : '#374151'} strokeWidth={1.5} />
            <text x={x} y={40} textAnchor="middle" fontSize={9} fontWeight="bold" fill={isActive ? 'white' : '#4b5563'}>{n}</text>
          </g>
        );
      })}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="#6b7280">{name}</text>
    </svg>
  );
}

export default function GammesPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Les gammes</h1>
          <p className="text-gray-400 mt-1">Majeure, mineure, jazz minor — les briques de base de toute la musique</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">1. La gamme chromatique — la mère de toutes les gammes</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Il existe exactement <strong className="text-white">12 sons</strong> dans notre système musical occidental.
            La gamme chromatique les contient tous, séparés d'un demi-ton (½T) chacun.
            Toute autre gamme est une <strong className="text-white">sélection de 5 à 7 notes</strong> dans ces 12.
          </p>
          <div className="bg-gray-900 rounded-xl p-3 font-mono text-sm text-center">
            <span className="text-orange-300">C</span>
            <span className="text-gray-500"> – C# – </span>
            <span className="text-orange-300">D</span>
            <span className="text-gray-500"> – D# – </span>
            <span className="text-orange-300">E</span>
            <span className="text-gray-500"> – </span>
            <span className="text-orange-300">F</span>
            <span className="text-gray-500"> – F# – </span>
            <span className="text-orange-300">G</span>
            <span className="text-gray-500"> – G# – </span>
            <span className="text-orange-300">A</span>
            <span className="text-gray-500"> – A# – </span>
            <span className="text-orange-300">B</span>
            <span className="text-gray-500"> – (C)</span>
          </div>
          <p className="text-gray-500 text-xs text-center">
            Sur la guitare : chaque case = 1 demi-ton. 12 cases = 1 octave.
          </p>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">2. La gamme majeure — le référentiel universel</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            La gamme majeure est <strong className="text-white">la</strong> gamme de référence. Toutes les autres se définissent par rapport à elle.
            Sa formule d'intervalles : <strong className="text-orange-300 font-mono">1T 1T ½T 1T 1T 1T ½T</strong>
          </p>
          <div className="overflow-x-auto">
            <ScaleSVG intervals={[2,2,1,2,2,2,1]} name="Gamme de Do majeur — 7 notes sur 12" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-white font-semibold mb-2">Caractère</p>
              <p className="text-gray-400">Lumineuse, stable, "joyeuse". La gamme que tout le monde reconnaît (<em>Do Ré Mi Fa Sol La Si</em>).</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-white font-semibold mb-2">En jazz</p>
              <p className="text-gray-400">Donne 7 accords de 7e (dont le fameux II–V–I). Base de toute l'harmonie jazz tonale.</p>
            </div>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">3. La gamme mineure naturelle (éolien)</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Même notes que la majeure, mais démarrer sur le <strong className="text-white">6e degré</strong>.
            Do majeur → La mineur naturel. Formule : <strong className="text-orange-300 font-mono">1T ½T 1T 1T ½T 1T 1T</strong>
          </p>
          <div className="overflow-x-auto">
            <ScaleSVG intervals={[2,1,2,2,1,2,2]} name="La mineur naturel — A B C D E F G" />
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-sm">
            <p className="text-white font-semibold mb-1">Le b3, b6, b7</p>
            <p className="text-gray-400">
              Par rapport à la gamme majeure, la mineure naturelle a 3 notes abaissées d'un demi-ton :
              la <strong className="text-blue-300">tierce (b3)</strong>, la <strong className="text-blue-300">sixte (b6)</strong> et la <strong className="text-blue-300">septième (b7)</strong>.
              Ce sont elles qui donnent la couleur "sombre" ou "mélancolique".
            </p>
          </div>
        </Box>

        <Box color="bg-teal-900/20 border border-teal-700">
          <h2 className="text-xl font-bold text-teal-200">4. La gamme mineure mélodique (jazz minor)</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            La gamme <strong className="text-white">la plus importante du jazz</strong> après la majeure.
            C'est une mineure naturelle avec la 6e et la 7e <strong className="text-white">remontées</strong> d'un demi-ton.
            Formule : <strong className="text-teal-300 font-mono">1T ½T 1T 1T 1T 1T ½T</strong>
          </p>
          <div className="overflow-x-auto">
            <ScaleSVG intervals={[2,1,2,2,2,2,1]} name="La mineur mélodique — A B C D E F# G#" />
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-2">
            <p className="text-white font-semibold">Pourquoi "mélodique" ?</p>
            <p className="text-gray-400">
              Classiquement, on remonte les 6e et 7e pour faciliter les lignes mélodiques vers l'octave.
              En jazz, on l'utilise <strong className="text-white">dans les deux sens</strong> (contrairement au classique qui redescend en mineur naturel).
            </p>
            <div className="border-t border-gray-800 pt-3">
              <p className="text-white font-semibold mb-2">Ses 7 modes donnent les accords jazz les plus colorés :</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {[
                  { deg: 'I', chord: 'mMaj7', note: 'Am△7', color: 'text-teal-300' },
                  { deg: 'II', chord: 'ø (sus)', note: 'Bø', color: 'text-gray-300' },
                  { deg: 'III', chord: 'Maj7#5', note: 'C△#5', color: 'text-cyan-300' },
                  { deg: 'IV', chord: 'Dom7 Lydien', note: 'D7#11', color: 'text-red-300' },
                  { deg: 'V', chord: 'Dom7 mixo', note: 'E7', color: 'text-red-300' },
                  { deg: 'VI', chord: 'ø7', note: 'F#ø', color: 'text-purple-300' },
                  { deg: 'VII', chord: 'Alt. Dom7', note: 'G7alt', color: 'text-rose-300' },
                ].map(r => (
                  <div key={r.deg} className="bg-gray-800 rounded p-2">
                    <p className="text-gray-500">{r.deg}</p>
                    <p className={`font-bold ${r.color}`}>{r.note}</p>
                    <p className="text-gray-600 text-[10px]">{r.chord}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">5. Comparaison rapide des 4 gammes clés</h2>
          <div className="space-y-3 text-sm">
            <ScaleRow name="Majeure" formula="1T 1T ½T 1T 1T 1T ½T" notes="C  D  E  F  G  A  B" color="text-amber-300" />
            <ScaleRow name="Mineure naturelle" formula="1T ½T 1T 1T ½T 1T 1T" notes="C  D  Eb F  G  Ab Bb" color="text-blue-300" />
            <ScaleRow name="Mineure mélodique (jazz)" formula="1T ½T 1T 1T 1T 1T ½T" notes="C  D  Eb F  G  A  B" color="text-teal-300" />
            <ScaleRow name="Mineure harmonique" formula="1T ½T 1T 1T ½T 1½T ½T" notes="C  D  Eb F  G  Ab B" color="text-purple-300" />
          </div>
          <p className="text-gray-500 text-xs">
            La mineure harmonique a un intervalle de 1½T (seconde augmentée) entre Ab et B — c'est lui qui donne la couleur "orientale" qu'on entend souvent.
          </p>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">6. Sur le manche — comment mémoriser</h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-white font-semibold mb-2">La règle des tons et demi-tons sur une corde</p>
              <p className="text-gray-400 mb-2">En partant de n'importe quelle note sur une corde :</p>
              <div className="flex gap-2 flex-wrap font-mono text-xs">
                {['1T','1T','½T','1T','1T','1T','½T'].map((iv, i) => (
                  <span key={i} className={`px-2 py-1 rounded ${iv === '½T' ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-blue-900/40 text-blue-300 border border-blue-800'}`}>
                    {iv}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 mt-2 text-xs">1T = 2 cases · ½T = 1 case</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-white font-semibold mb-2">La logique des positions CAGED</p>
              <p className="text-gray-400">
                Les 5 positions CAGED découpent le manche en 5 fenêtres de 4 cases.
                Chaque position utilise les mêmes intervalles — seule la forme de la main change.
                C'est tout l'objet du visualiseur sur la page d'accueil.
              </p>
            </div>
          </div>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto/modes"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Cours suivant : Les modes →
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
