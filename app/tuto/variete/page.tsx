import Link from 'next/link';

function Quote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <blockquote className="border-l-4 border-orange-500 pl-4 py-1 my-4">
      <p className="text-orange-200 italic text-base leading-relaxed">{children}</p>
      {author && <p className="text-gray-500 text-sm mt-1">— {author}</p>}
    </blockquote>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-orange-300">{title}</h2>
      {children}
    </div>
  );
}

export default function VarietePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* Navigation */}
        <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>

        {/* Header */}
        <div className="space-y-4 border-b border-gray-800 pb-8">
          <p className="text-gray-500 text-sm uppercase tracking-widest">Une lettre à un musicien de variété</p>
          <h1 className="text-4xl font-bold leading-tight">
            Je viens de la variété.<br/>
            <span className="text-orange-400">Qu'est-ce que le jazz va changer ?</span>
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Imagine un vieux type assis au bar après le concert. Il a joué avec les meilleurs,
            tourné dans vingt pays, vieilli sur scène. Il commande un verre, te regarde et dit :
          </p>
        </div>

        {/* The letter */}
        <div className="space-y-10 text-gray-300 leading-relaxed">

          <Section title="Tu sais déjà jouer.">
            <p>
              Ne laisse personne te dire le contraire. La variété, le pop, le rock — c'est une école sérieuse.
              Tu as appris à servir une mélodie, à jouer en groupe, à sentir ce qu'un public veut.
              Tu connais la pulsation, tu connais les dynamiques. <strong className="text-white">Tu as déjà l'essentiel.</strong>
            </p>
            <p>
              La plupart des grands jazzmen ont commencé exactement comme toi. Miles Davis écoutait Frank Sinatra
              en boucle. Joe Pass jouait dans des bars à danser. Herbie Hancock accompagnait des chanteurs de variété.
              Le jazz n'est pas une religion séparée — c'est le même fleuve, juste plus loin en amont.
            </p>
            <Quote author="Miles Davis">
              Je ne joue pas ce qu'il y a. Je joue ce qu'il n'y a pas.
            </Quote>
          </Section>

          <Section title="Ton premier choc : l'harmonie étendue.">
            <p>
              En variété, tu joues <span className="font-mono text-orange-300">C – Am – F – G</span>.
              Des accords simples, efficaces, magnifiques. Ils font leur travail.
            </p>
            <p>
              Le jazz prend exactement ces mêmes accords et les habille différemment :
            </p>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm space-y-2">
              <p><span className="text-gray-500">Variété :</span> <span className="text-gray-300">C – Am – F – G</span></p>
              <p><span className="text-orange-400">Jazz :</span> <span className="text-amber-300">C△7 – Am7 – F△7 – G7 – Em7 – A7alt – Dm7 – G7</span></p>
            </div>
            <p>
              Tu entends la différence ? Ce n'est pas juste "plus compliqué". C'est <strong className="text-white">plus coloré</strong>.
              Chaque accord porte maintenant une émotion précise. Le G7 veut aller quelque part.
              Le Em7 flotte. Le A7alt crée une tension que tu n'avais jamais entendue.
            </p>
            <Quote>
              Écoute un accord de Coltrane. Ferme les yeux. Tu sens cette note qui frémit,
              qui cherche sa résolution ? C'est la magie de la septième, de la neuvième,
              du triton. Ces sons que la variété évite soigneusement — et que le jazz
              embrasse avec passion.
            </Quote>
          </Section>

          <Section title="Le rythme va te transformer.">
            <p>
              Tu joues en 4/4 ? Bien. Mais est-ce que tu joues vraiment <em>dedans</em> ?
            </p>
            <p>
              Le swing, c'est l'art de jouer légèrement <strong className="text-white">en retard et en avance</strong>
              en même temps. C'est paradoxal, je sais. Mais c'est exactement ça.
              Tu as entendu cette marche de la basse dans un trio jazz ?
              Ce balancement qui te fait hocher la tête malgré toi ?
              C'est le <em>groove</em> swing — et ça prend des mois à intégrer dans le corps.
            </p>
            <p>
              Mais quand ça arrive... tu ne joues plus jamais comme avant. Même tes chansons de variété
              auront un autre parfum. Tes notes auront plus de poids, plus d'espace.
            </p>
            <Quote>
              J'ai rencontré un guitariste qui avait passé dix ans dans la pop.
              Il est venu à un stage de jazz et après trois jours de travail sur le swing,
              il m'a dit : "Je réalise que je n'avais jamais vraiment écouté le temps."
              Voilà ce que le jazz t'offre. La présence totale dans le moment musical.
            </Quote>
          </Section>

          <Section title="L'improvisation : apprendre à parler.">
            <p>
              En variété, tu joues ce qu'on t'a écrit. En jazz, <strong className="text-white">tu inventes en direct</strong>.
            </p>
            <p>
              Ça peut faire peur. Et ça devrait. Parce que c'est une langue. Et comme toute langue,
              tu vas d'abord bégayer. Tu vas jouer des gammes mécaniquement, des phrases toutes faites.
              C'est normal — on passe tous par là.
            </p>
            <p>
              Mais un jour — et ce jour arrive, je te le promets — tu vas jouer une phrase
              que tu n'avais jamais jouée de ta vie. Une phrase qui vient de nulle part et qui
              exprime exactement ce que tu ressens à cet instant. Et tu te diras :
              <em className="text-orange-200"> "Ah. C'est ça. C'est pour ça que les jazzmen font ça."</em>
            </p>
            <Quote>
              L'improvisation, c'est une conversation. Tu écoutes l'accord, tu réponds.
              Tu écoutes le bassiste, tu lui parles. Tu écoutes le silence — et tu sais
              quand ne pas jouer. C'est comme une conversation entre amis intelligents.
              Sauf que c'est avec des sons.
            </Quote>
          </Section>

          <Section title="Ce que les arpèges vont changer dans ta tête.">
            <p>
              Tu joues des gammes, comme tout le monde. C'est bien.
              Mais les arpèges — jouer les notes d'un accord comme une mélodie —
              vont te donner quelque chose de précieux : <strong className="text-white">la conscience harmonique</strong>.
            </p>
            <p>
              Quand tu joues un arpège de Dm7 sur un accord de Dm7, tu n'es plus en train
              de "faire du bruit compatible". Tu <em>racontes l'accord</em>. Tu joues la tierce,
              la septième — les notes qui définissent la couleur de l'accord.
              Tu commences à entendre la musique différemment.
            </p>
            <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-2">
              <p className="text-gray-400">La progression de tout jazzman :</p>
              <div className="space-y-1 text-sm">
                {[
                  { level: '1. Gamme', desc: "Je joue des notes de la gamme sur n'importe quel accord", color: 'text-gray-400' },
                  { level: '2. Arpège', desc: 'Je joue les notes de CET accord sur CET accord', color: 'text-blue-300' },
                  { level: '3. Phrase', desc: "J'utilise l'arpège pour créer une phrase musicale", color: 'text-teal-300' },
                  { level: '4. Langage', desc: "Je ne pense plus — je parle.", color: 'text-orange-300' },
                ].map(l => (
                  <div key={l.level} className="flex gap-3 items-baseline">
                    <span className={`font-bold shrink-0 text-xs w-24 ${l.color}`}>{l.level}</span>
                    <span className="text-gray-400 text-xs">{l.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <Quote>
              Tu en es à l'étape 2. C'est exactement là où il faut être.
              Les étapes 3 et 4 viendront d'elles-mêmes, avec du temps et de l'écoute.
              Fais confiance au processus.
            </Quote>
          </Section>

          <Section title="La communauté jazz.">
            <p>
              Il y a quelque chose que personne ne dit assez : le jazz, c'est
              <strong className="text-white"> les gens</strong>.
            </p>
            <p>
              Une jam session dans un sous-sol parisien. Un quartet qui joue depuis 30 ans ensemble.
              Un vieux batteur qui t'enseigne un pattern en te regardant dans les yeux.
              Une guitare qu'on passe de main en main dans une pièce qui sent le café froid.
            </p>
            <p>
              Le jazz a une culture de transmission orale, de générosité, de respect du passé
              et d'ouverture vers l'inconnu. Quand tu entres dans cette communauté, tu rejoins
              une lignée qui remonte à Armstrong, Parker, Monk — une famille musicale mondiale.
            </p>
            <Quote>
              Je me souviens de ma première jam session. J'avais 23 ans, je tremblais.
              Le pianiste m'a dit : "Joue ce que tu entends. Si c'est faux, c'est du jazz."
              Je n'ai jamais oublié ça.
            </Quote>
          </Section>

          <Section title="Ta route commence ici.">
            <p>
              Tu as un avantage énorme sur quelqu'un qui n'a jamais joué de musique :
              tu as des doigts entraînés, une oreille musicale, un sens du jeu collectif.
              <strong className="text-white"> Le jazz n'est pas un nouveau départ — c'est une continuation.</strong>
            </p>
            <p>
              Commence par un standard. Autumn Leaves. Blue Bossa. Fly Me To The Moon.
              Apprends la mélodie par cœur. Joue les accords simples. Puis écoute les grands :
              Bill Evans, Wes Montgomery, Joe Pass. Pas pour les imiter — pour rêver.
            </p>
            <p>
              Et chaque soir, quelques minutes sur le manche. Un arpège par semaine.
              Une position. Une tonalité. <em>La régularité bat le talent.</em>
            </p>
            <div className="bg-orange-900/30 border border-orange-700 rounded-2xl p-5 space-y-3">
              <p className="text-orange-300 font-bold text-lg">Le programme de la première année</p>
              <ol className="space-y-2 text-sm">
                {[
                  'Maîtriser les 4 arpèges de base (Maj7, m7, Dom7, m7b5) en Do majeur, 5 positions',
                  'Jouer le II–V–I dans les 12 tonalités, une position à la fois',
                  "Apprendre 5 standards par cœur (mélodie + accords)",
                  "Aller à 3 jam sessions. Juste écouter les deux premières.",
                  "À la troisième : jouer. Une phrase. Une seule. Bien.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-orange-400 shrink-0">{i + 1}.</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Quote author="Charlie Parker">
              Maîtrisez votre instrument, maîtrisez la musique, puis oubliez tout ça
              et jouez.
            </Quote>

            <p className="text-gray-300">
              Voilà ce qui t'attend. Ce n'est pas un raccourci — c'est une route longue
              et magnifique. Et je t'envie de la commencer.
            </p>
            <p className="text-orange-300 font-semibold text-lg mt-2">
              Maintenant, va ouvrir le manche. Et joue.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-6 flex flex-wrap gap-3 justify-center">
          <Link href="/"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Ouvrir le visualiseur →
          </Link>
          <Link href="/tuto/intervalles"
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Commencer par les intervalles
          </Link>
        </div>

      </div>
    </main>
  );
}
