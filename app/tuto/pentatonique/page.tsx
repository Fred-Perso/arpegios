import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

function PentaGrid({ notes, active, colors }: { notes: string[]; active: boolean[]; colors: string[] }) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-center py-2">
      {notes.map((n, i) => (
        <div key={i}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 ${active[i] ? '' : 'bg-gray-800 border-gray-700 text-gray-600'}`}
          style={active[i] ? { background: colors[i], borderColor: 'white', color: 'white' } : {}}>
          {n}
        </div>
      ))}
    </div>
  );
}

export default function PentatoniquePage() {
  const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const majorPenta = [0, 2, 4, 7, 9];
  const minorPenta = [0, 3, 5, 7, 10];
  const blues      = [0, 3, 5, 6, 7, 10];

  const majorColors = chromatic.map((_, i) =>
    majorPenta.includes(i) ? '#f97316' : 'transparent'
  );
  const minorColors = chromatic.map((_, i) =>
    minorPenta.includes(i) ? '#3b82f6' : 'transparent'
  );
  const bluesColors = chromatic.map((_, i) =>
    blues.includes(i) ? (i === 6 ? '#a855f7' : '#3b82f6') : 'transparent'
  );

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">La pentatonique en jazz</h1>
          <p className="text-gray-400 mt-1">5 notes, une liberté infinie — de la gamme de blues à l'approche modale</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">1. Pourquoi 5 notes ?</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            La gamme majeure a 7 notes. Enlève les deux <strong className="text-white">notes qui "grattent"</strong> — le 4 (F contre E) et le 7 (B contre C) — et il reste
            <strong className="text-orange-300"> 5 notes qui sonnent bien ensemble quasiment dans n'importe quelle situation</strong>.
            C'est la pentatonique majeure.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400 text-xs w-36">Majeure (7 notes) :</span>
              <span className="font-mono text-white">C D E <span className="line-through text-gray-600">F</span> G A <span className="line-through text-gray-600">B</span></span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-400 text-xs w-36">Pentatonique (5 notes) :</span>
              <span className="font-mono text-orange-300">C D E G A</span>
              <span className="text-gray-500 text-xs">= 1 2 3 5 6</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Ces 5 notes n'ont aucune tension entre elles. C'est pour ça qu'on les retrouve dans <em>toutes</em> les musiques du monde : folk, blues, rock, jazz, musiques africaines, asiatiques…
          </p>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">2. La pentatonique majeure</h2>
          <div className="overflow-x-auto">
            <PentaGrid notes={chromatic} active={chromatic.map((_, i) => majorPenta.includes(i))} colors={majorColors} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="text-white font-semibold">Formule</p>
              <p className="font-mono text-orange-300 text-lg">1 – 2 – 3 – 5 – 6</p>
              <p className="font-mono text-gray-400 text-xs">demi-tons : 0 – 2 – 4 – 7 – 9</p>
              <p className="font-mono text-gray-300 text-sm">C D E G A</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="text-white font-semibold">Caractère & usage</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Lumineuse, "country", folk. Parfaite sur les accords majeurs.
                Sur un <strong className="text-white">C△7</strong>, jouer Do penta majeure fonctionne immédiatement.
              </p>
            </div>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">3. La pentatonique mineure</h2>
          <div className="overflow-x-auto">
            <PentaGrid notes={chromatic} active={chromatic.map((_, i) => minorPenta.includes(i))} colors={minorColors} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="text-white font-semibold">Formule</p>
              <p className="font-mono text-blue-300 text-lg">1 – b3 – 4 – 5 – b7</p>
              <p className="font-mono text-gray-400 text-xs">demi-tons : 0 – 3 – 5 – 7 – 10</p>
              <p className="font-mono text-gray-300 text-sm">C Eb F G Bb</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="text-white font-semibold">Caractère & usage</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                La gamme du blues et du rock. Sur un <strong className="text-white">Cm7</strong>,
                jouer Do penta mineure fonctionne à 100%.
                C'est aussi la penta majeure de <strong className="text-white">Eb</strong> (relatif majeur).
              </p>
            </div>
          </div>
          <div className="bg-indigo-900/30 rounded-xl p-4 text-sm border border-indigo-800">
            <p className="text-indigo-200 font-semibold mb-1">Lien relatif à retenir</p>
            <p className="text-gray-300 text-xs">
              La pentatonique mineure de <strong className="text-white">A</strong> = pentatonique majeure de <strong className="text-white">C</strong>.
              Ce sont les mêmes 5 notes — juste le point de départ change.
              <br />Am penta : A C D E G — C penta : C D E G A ✓
            </p>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">4. La gamme de blues — la 6e note</h2>
          <div className="overflow-x-auto">
            <PentaGrid notes={chromatic} active={chromatic.map((_, i) => blues.includes(i))} colors={bluesColors} />
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-2">
            <p className="font-mono text-blue-300">1 – b3 – 4 – <span className="text-purple-400">b5</span> – 5 – b7</p>
            <p className="font-mono text-gray-400 text-xs">C Eb F <span className="text-purple-400">Gb</span> G Bb</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              La pentatonique mineure + une note : la <strong className="text-purple-300">quinte diminuée (b5)</strong>,
              appelée <strong className="text-purple-300">blue note</strong>. Elle crée cette tension caractéristique du blues —
              ni vraiment dans la gamme, ni hors de la gamme. On la joue souvent en glissé (<em>bend</em>).
            </p>
          </div>
        </Box>

        <Box color="bg-orange-900/20 border border-orange-800">
          <h2 className="text-xl font-bold text-orange-200">5. L'approche jazz — jouer des pentas "décalées"</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Le vrai secret du jazz pentatonique : <strong className="text-white">ne pas jouer la penta "évidente"</strong>.
            Les jazzers jouent des pentatoniques depuis d'autres degrés que la fondamentale — ce qui crée des tensions calculées.
          </p>
          <div className="space-y-3">
            {[
              {
                over: 'Sur Cm7 (dorien)',
                play: 'Eb majeure ou Bb majeure',
                why: 'Eb maj = 1 b3 4 5 6 sur Cm = naturel. Bb maj depuis Cm ajoute la 9e et la 13e — son jazz moderne.',
                level: 'Facile', color: 'text-green-400',
              },
              {
                over: 'Sur G7 (dominant)',
                play: 'D mineure ou A mineure',
                why: 'Dm penta sur G7 = 5 6 1 9 4 — toutes les extensions de la dominante. Son bebop.',
                level: 'Intermédiaire', color: 'text-yellow-400',
              },
              {
                over: 'Sur G7alt (altéré)',
                play: 'Db majeure (triton !)',
                why: 'Db maj = b5 b6 b7 b9 b3 sur G7 — toutes les altérations en 5 notes. Son moderne.',
                level: 'Avancé', color: 'text-red-400',
              },
              {
                over: 'Sur C△7 (ionien/lydien)',
                play: 'E mineure ou B mineure',
                why: 'Em penta = 3 4 5 7 2 sur C△7 — toutes les couleurs du Maj7 en évitant la fondamentale.',
                level: 'Intermédiaire', color: 'text-yellow-400',
              },
            ].map(r => (
              <div key={r.over} className="bg-gray-900 rounded-xl p-4 text-sm space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white font-bold">{r.over}</span>
                  <span className="text-gray-500 text-xs">→ jouer</span>
                  <span className="text-orange-300 font-bold">{r.play}</span>
                  <span className={`ml-auto text-xs font-bold ${r.color}`}>{r.level}</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{r.why}</p>
              </div>
            ))}
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">6. Les 5 positions sur le manche</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Comme pour les arpèges, la pentatonique se joue en <strong className="text-white">5 positions</strong> sur le manche.
            La bonne nouvelle : les formes pentatoniques sont <strong className="text-white">plus simples</strong> que les positions d'arpèges
            (moins de notes par position, doigtés symétriques).
          </p>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-3">
            <p className="text-white font-semibold">Stratégie d'apprentissage recommandée</p>
            <ol className="space-y-2 text-gray-400 text-xs list-decimal list-inside">
              <li>Apprenez la position 1 (la plus connue) en Am penta — case 5 sur la 6e corde.</li>
              <li>Apprenez à jouer la même chose en <em>majeur</em> en démarrant 3 cases plus bas (relatif).</li>
              <li>Connectez les 5 positions en remontant le manche.</li>
              <li>Pratiquez sur un blues en La 12 mesures — d'abord Am penta, puis essayez Dm penta par-dessus.</li>
              <li>Utilisez le visualiseur de ce site pour voir les arpèges : les notes de l'arpège sont <em>incluses</em> dans la penta correspondante.</li>
            </ol>
          </div>
          <div className="bg-indigo-900/30 rounded-xl p-4 text-sm border border-indigo-800">
            <p className="text-indigo-200 font-semibold mb-1">Penta et arpèges — la connexion</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              Un arpège de Cm7 (C Eb G Bb) est contenu dans la penta mineure de C (C Eb F G Bb).
              Il manque juste le F (la quarte). En impro, tu peux donc passer de l'arpège à la penta sans changer de position — tu ajoutes juste une note.
            </p>
          </div>
        </Box>

        <Box color="bg-gray-900">
          <h2 className="text-xl font-bold">En résumé</h2>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            {[
              { title: 'Débutant', content: 'Apprendre Am et A majeur penta. Jouer sur blues 12 mesures. Connecter les 5 positions.', color: 'text-green-400' },
              { title: 'Intermédiaire', content: 'Jouer Dm penta sur G7. Alterner penta et arpège sur un II–V–I. Autumn Leaves en penta.', color: 'text-yellow-400' },
              { title: 'Avancé', content: 'Pentas décalées (triton sub). Superimposition sur standards. Mélanger penta + gamme altérée.', color: 'text-red-400' },
            ].map(r => (
              <div key={r.title} className="bg-gray-800 rounded-xl p-4">
                <p className={`font-bold mb-2 ${r.color}`}>{r.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto/deux-cinq-un"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Cours suivant : Le II–V–I →
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
