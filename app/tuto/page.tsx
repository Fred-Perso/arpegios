import Link from 'next/link';

const PARCOURS = [
  {
    step: 1,
    href: '/tuto/variete',
    title: 'Je viens de la variété',
    subtitle: 'Pourquoi le jazz va tout changer',
    desc: "Un vieux jazzman t'explique ce qui t'attend. Inspiration, motivation, la route devant toi.",
    icon: '🎸',
    color: 'border-orange-600 bg-orange-900/20 hover:bg-orange-900/30',
    badge: 'bg-orange-700',
    time: '5 min',
    tag: 'Motivation',
  },
  {
    step: 2,
    href: '/tuto/intervalles',
    title: 'Les intervalles',
    subtitle: 'La brique fondamentale',
    desc: "Demi-tons, tierces, quintes. Pourquoi certains accords sont mineurs dans une tonalité majeure. Schémas visuels.",
    icon: '📐',
    color: 'border-indigo-600 bg-indigo-900/20 hover:bg-indigo-900/30',
    badge: 'bg-indigo-700',
    time: '10 min',
    tag: 'Théorie fondamentale',
  },
  {
    step: 3,
    href: '/tuto',
    title: 'Harmonie de la gamme majeure',
    subtitle: 'Les 7 accords de 7e',
    desc: "Comment construire les 7 arpèges de la gamme majeure. Tableaux, formules, logique des degrés.",
    icon: '🎼',
    color: 'border-teal-600 bg-teal-900/20 hover:bg-teal-900/30',
    badge: 'bg-teal-700',
    time: '10 min',
    tag: 'Harmonie',
  },
  {
    step: 4,
    href: '/tuto/deux-cinq-un',
    title: 'Le II–V–I pour les nuls',
    subtitle: 'La progression centrale du jazz',
    desc: "Rôle de chaque accord, le triton qui crée la tension, exercices dans les 12 tonalités.",
    icon: '⚡',
    color: 'border-red-600 bg-red-900/20 hover:bg-red-900/30',
    badge: 'bg-red-700',
    time: '15 min',
    tag: 'Progression clé',
  },
  {
    step: 5,
    href: '/tuto/croches-ternaires',
    title: 'Croches ternaires (swing)',
    subtitle: 'Le secret du feeling jazz',
    desc: "Comprendre et entendre la différence entre binaire et ternaire. Diagrammes, exemples audio, exercices.",
    icon: '🎷',
    color: 'border-cyan-600 bg-cyan-900/20 hover:bg-cyan-900/30',
    badge: 'bg-cyan-700',
    time: '10 min',
    tag: 'Rythme essentiel',
  },
  {
    step: 7,
    href: '/tuto/standard',
    title: 'Autumn Leaves — standard école',
    subtitle: 'Mettre la théorie en pratique',
    desc: "La grille complète annotée avec tous les II–V–I. Comment naviguer les changements d'accords.",
    icon: '🍂',
    color: 'border-amber-600 bg-amber-900/20 hover:bg-amber-900/30',
    badge: 'bg-amber-700',
    time: '15 min',
    tag: 'Application pratique',
  },
  {
    step: 8,
    href: '/tuto/histoire',
    title: 'L\'évolution du jazz',
    subtitle: 'De 1900 à aujourd\'hui',
    desc: "New Orleans, Swing, Bebop, Modal, Fusion, Jazz contemporain. 130 ans d'innovation.",
    icon: '🕰️',
    color: 'border-purple-600 bg-purple-900/20 hover:bg-purple-900/30',
    badge: 'bg-purple-700',
    time: '10 min',
    tag: 'Culture',
  },
];

export default function TutoIndexPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Théorie & Culture Jazz</h1>
          <p className="text-gray-400 mt-1">Un parcours progressif — du débutant motivé au musicien qui comprend.</p>
        </div>

        {/* Progress path */}
        <div className="space-y-3">
          {PARCOURS.map((p, i) => (
            <Link key={p.step} href={p.href}
              className={`block border rounded-2xl p-4 transition-colors ${p.color}`}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${p.badge}`}>
                    {p.step}
                  </span>
                  {i < PARCOURS.length - 1 && (
                    <div className="w-0.5 h-4 bg-gray-700"/>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-lg font-bold text-white">{p.icon} {p.title}</span>
                    <span className="text-xs bg-gray-700/60 text-gray-400 rounded px-2 py-0.5">{p.tag}</span>
                    <span className="text-xs text-gray-500 ml-auto">~{p.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium">{p.subtitle}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Advanced section */}
        <div className="pt-2">
          <h2 className="text-xl font-bold text-gray-300 mb-1">Harmonie avancée</h2>
          <p className="text-gray-500 text-sm mb-3">Après avoir maîtrisé le II–V–I — les outils du jazzman moderne.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href:'/tuto/enrichissements',          icon:'🎨', title:'Enrichissements',           sub:'9e, 11e, 13e — colorer les accords',                color:'border-teal-700 bg-teal-900/15 hover:bg-teal-900/25' },
              { href:'/tuto/dominantes-secondaires',   icon:'⚡', title:'Dominantes secondaires',    sub:'Toniciser temporairement n\'importe quel accord',  color:'border-red-700 bg-red-900/15 hover:bg-red-900/25' },
              { href:'/tuto/substitutions-tritoniques',icon:'🔄', title:'Substitutions tritoniques', sub:'Remplacer un V7 par l\'accord à 6 demi-tons',       color:'border-indigo-700 bg-indigo-900/15 hover:bg-indigo-900/25' },
              { href:'/tuto/emprunts-modaux',          icon:'🌀', title:'Emprunts modaux',           sub:'Emprunter des accords aux modes parallèles',        color:'border-purple-700 bg-purple-900/15 hover:bg-purple-900/25' },
              { href:'/tuto/reharmonisation',          icon:'🎭', title:'Réharmonisation',           sub:'Transformer et enrichir une grille existante',      color:'border-amber-700 bg-amber-900/15 hover:bg-amber-900/25' },
              { href:'/tuto/analyse-standards',        icon:'🔍', title:'Analyse de standards',      sub:'Blue Bossa, All The Things You Are, Autumn Leaves', color:'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50' },
              { href:'/tuto/bebop',                    icon:'🎺', title:'Style bebop',                 sub:'Gammes, encadrements, licks — le langage bebop',    color:'border-purple-700 bg-purple-900/15 hover:bg-purple-900/25' },
              { href:'/tuto/licks-2-5-1',             icon:'🎸', title:'Licks II–V–I',                 sub:'5 guitaristes · tablature + lecteur MIDI · tempos',  color:'border-orange-700 bg-orange-900/15 hover:bg-orange-900/25' },
            ].map(p => (
              <Link key={p.href} href={p.href}
                className={`block border rounded-xl p-4 transition-colors ${p.color}`}>
                <p className="font-bold text-white text-sm">{p.icon} {p.title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{p.sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center">
          <div>
            <p className="font-semibold text-white">Prêt à pratiquer ?</p>
            <p className="text-sm text-gray-400 mt-0.5">Ouvre le visualiseur de manche et commence à jouer.</p>
          </div>
          <Link href="/"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shrink-0">
            Ouvrir le manche →
          </Link>
        </div>

      </div>
    </main>
  );
}
