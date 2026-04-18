import Link from 'next/link';

// Chord chart for Autumn Leaves
const CHART = [
  // Section A
  [
    { chord:'Cm7',    type:'m7',   role:'IIm7',  key:'Bb majeur',   color:'bg-blue-900/50 border-blue-600',  text:'text-blue-300'  },
    { chord:'F7',     type:'Dom7', role:'V7',     key:'Bb majeur',   color:'bg-red-900/50 border-red-600',    text:'text-red-300'   },
    { chord:'Bb△7',   type:'Maj7', role:'I△7',    key:'Bb majeur',   color:'bg-amber-900/50 border-amber-600',text:'text-amber-300' },
    { chord:'Eb△7',   type:'Maj7', role:'IV△7',   key:'Bb majeur',   color:'bg-gray-800 border-gray-600',     text:'text-gray-300'  },
  ],
  [
    { chord:'Am7b5',  type:'m7b5', role:'IIø7',   key:'Sol mineur',  color:'bg-blue-900/50 border-blue-600',  text:'text-blue-300'  },
    { chord:'D7',     type:'Dom7', role:'V7',      key:'Sol mineur',  color:'bg-red-900/50 border-red-600',    text:'text-red-300'   },
    { chord:'Gm7',    type:'m7',   role:'Im7',     key:'Sol mineur',  color:'bg-amber-900/50 border-amber-600',text:'text-amber-300' },
    { chord:'Gm7',    type:'m7',   role:'—',       key:'',            color:'bg-gray-800 border-gray-600',     text:'text-gray-300'  },
  ],
  // Section B (répétition inversée)
  [
    { chord:'Am7b5',  type:'m7b5', role:'IIø7',   key:'Sol mineur',  color:'bg-blue-900/50 border-blue-600',  text:'text-blue-300'  },
    { chord:'D7',     type:'Dom7', role:'V7',      key:'Sol mineur',  color:'bg-red-900/50 border-red-600',    text:'text-red-300'   },
    { chord:'Gm7',    type:'m7',   role:'Im7',     key:'Sol mineur',  color:'bg-amber-900/50 border-amber-600',text:'text-amber-300' },
    { chord:'Gm7',    type:'m7',   role:'—',       key:'',            color:'bg-gray-800 border-gray-600',     text:'text-gray-300'  },
  ],
  [
    { chord:'Cm7',    type:'m7',   role:'IIm7',   key:'Bb majeur',   color:'bg-blue-900/50 border-blue-600',  text:'text-blue-300'  },
    { chord:'F7',     type:'Dom7', role:'V7',      key:'Bb majeur',   color:'bg-red-900/50 border-red-600',    text:'text-red-300'   },
    { chord:'Bb△7',   type:'Maj7', role:'I△7',     key:'Bb majeur',   color:'bg-amber-900/50 border-amber-600',text:'text-amber-300' },
    { chord:'Eb△7',   type:'Maj7', role:'IV△7',    key:'Bb majeur',   color:'bg-gray-800 border-gray-600',     text:'text-gray-300'  },
  ],
  // Section C (bridge)
  [
    { chord:'Am7b5',  type:'m7b5', role:'IIø7',   key:'Sol mineur',  color:'bg-blue-900/50 border-blue-600',  text:'text-blue-300'  },
    { chord:'D7',     type:'Dom7', role:'V7',      key:'Sol mineur',  color:'bg-red-900/50 border-red-600',    text:'text-red-300'   },
    { chord:'Gm',     type:'m7',   role:'Im',      key:'Sol mineur',  color:'bg-amber-900/50 border-amber-600',text:'text-amber-300' },
    { chord:'G7',     type:'Dom7', role:'(pivot)', key:'',            color:'bg-gray-800 border-gray-600',     text:'text-gray-300'  },
  ],
  [
    { chord:'Cm7',    type:'m7',   role:'IIm7',   key:'Bb majeur',   color:'bg-blue-900/50 border-blue-600',  text:'text-blue-300'  },
    { chord:'F7',     type:'Dom7', role:'V7',      key:'Bb majeur',   color:'bg-red-900/50 border-red-600',    text:'text-red-300'   },
    { chord:'Bb△7',   type:'Maj7', role:'I△7',     key:'Bb majeur',   color:'bg-amber-900/50 border-amber-600',text:'text-amber-300' },
    { chord:'Bb7',    type:'Dom7', role:'(pivot)', key:'',            color:'bg-gray-800 border-gray-600',     text:'text-gray-300'  },
  ],
  // Final A
  [
    { chord:'Am7b5',  type:'m7b5', role:'IIø7',   key:'Sol mineur',  color:'bg-blue-900/50 border-blue-600',  text:'text-blue-300'  },
    { chord:'D7',     type:'Dom7', role:'V7',      key:'Sol mineur',  color:'bg-red-900/50 border-red-600',    text:'text-red-300'   },
    { chord:'Gm7',    type:'m7',   role:'Im7',     key:'Sol mineur',  color:'bg-amber-900/50 border-amber-600',text:'text-amber-300' },
    { chord:'E7',     type:'Dom7', role:'(subst.)', key:'',           color:'bg-gray-800 border-gray-600',     text:'text-gray-300'  },
  ],
  [
    { chord:'Am7b5',  type:'m7b5', role:'IIø7',   key:'Sol mineur',  color:'bg-blue-900/50 border-blue-600',  text:'text-blue-300'  },
    { chord:'D7',     type:'Dom7', role:'V7',      key:'Sol mineur',  color:'bg-red-900/50 border-red-600',    text:'text-red-300'   },
    { chord:'Gm6',    type:'m7',   role:'Im6',     key:'Sol mineur',  color:'bg-amber-900/50 border-amber-600',text:'text-amber-300' },
    { chord:'Gm6',    type:'m7',   role:'fin',     key:'',            color:'bg-gray-800 border-gray-600',     text:'text-gray-300'  },
  ],
];

const SECTIONS = ['A (1–4)', 'A (5–8)', "A' (9–12)", "A' (13–16)", 'B (17–20)', 'B (21–24)', 'A″ (25–28)', 'A″ (29–32)'];

const PRACTICE = [
  { step: 1, key: 'Bb majeur', ii: 'Cm7', v: 'F7', i: 'Bb△7', note: 'II-V-I classique. Cm7 sur II degré, F7 sur V, Bb△7 sur I.' },
  { step: 2, key: 'Sol mineur', ii: 'Am7b5', v: 'D7', i: 'Gm7', note: 'II-V-I mineur. Aø7 est le IIø7 (semi-diminué) du mineur mélodique de Sol.' },
];

export default function StandardPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Autumn Leaves — le standard école</h1>
          <p className="text-gray-400 mt-1">Les feuilles mortes · Le standard idéal pour voir les II–V–I à l'œuvre</p>
        </div>

        {/* Why this standard */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-xl font-bold">Pourquoi Autumn Leaves ?</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">Autumn Leaves</strong> (Les feuilles mortes, Joseph Kosma / Jacques Prévert, 1945)
            est le standard d'école par excellence pour le jazz. Il contient exactement deux tonalités entrelacées :
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-amber-900/30 border border-amber-700 rounded-xl p-4">
              <p className="text-amber-300 font-bold text-lg">Si♭ majeur</p>
              <p className="text-amber-200 text-sm mt-1">II–V–I majeur</p>
              <p className="font-mono text-xs text-gray-300 mt-2">Cm7 → F7 → B♭△7</p>
              <p className="text-gray-400 text-xs mt-1">Son lumineux, résolution douce</p>
            </div>
            <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4">
              <p className="text-blue-300 font-bold text-lg">Sol mineur</p>
              <p className="text-blue-200 text-sm mt-1">II–V–I mineur</p>
              <p className="font-mono text-xs text-gray-300 mt-2">Am7b5 → D7 → Gm</p>
              <p className="text-gray-400 text-xs mt-1">Couleur sombre, tension forte</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Ces deux tonalités sont relatives (même armure). Le standard alterne entre elles,
            ce qui crée ce mouvement de lumière/ombre si caractéristique.
          </p>
        </div>

        {/* Chord chart */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-xl font-bold">Grille complète annotée (32 mesures)</h2>
          <div className="flex flex-wrap gap-3 text-xs mb-2">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-700 inline-block"/>IIm7 / IIø7 — sous-dominante</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-700 inline-block"/>V7 — dominante (tension)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-700 inline-block"/>I — tonique (résolution)</span>
          </div>

          <div className="space-y-2">
            {CHART.map((row, ri) => (
              <div key={ri}>
                <p className="text-xs text-gray-500 mb-1">Mesures {SECTIONS[ri]}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {row.map((cell, ci) => (
                    <div key={ci} className={`border rounded-lg p-2 ${cell.color}`}>
                      <p className={`font-bold text-base ${cell.text}`}>{cell.chord}</p>
                      {cell.role !== '—' && cell.role !== '' && (
                        <p className="text-xs opacity-70">{cell.role}</p>
                      )}
                      {cell.key && (
                        <p className="text-xs text-gray-500 truncate">{cell.key}</p>
                      )}
                    </div>
                  ))}
                </div>
                {/* II-V-I bracket for first and second rows */}
                {[0, 3, 5].includes(ri) && (
                  <p className="text-xs text-gray-600 mt-0.5 ml-1">↑ II–V–I en Si♭ majeur</p>
                )}
                {[1, 2, 4, 6, 7].includes(ri) && (
                  <p className="text-xs text-gray-600 mt-0.5 ml-1">↑ II–V–I en Sol mineur</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Practice guide */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-xl font-bold">Comment pratiquer avec le visualiseur</h2>
          <div className="space-y-4">
            {PRACTICE.map(p => (
              <div key={p.step} className="bg-gray-900 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold shrink-0">{p.step}</span>
                  <p className="font-semibold text-white">Cadence en {p.key}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm font-mono">
                  <span className="bg-blue-900/50 border border-blue-700 text-blue-300 rounded px-3 py-1">{p.ii}</span>
                  <span className="text-gray-500 self-center">→</span>
                  <span className="bg-red-900/50 border border-red-700 text-red-300 rounded px-3 py-1">{p.v}</span>
                  <span className="text-gray-500 self-center">→</span>
                  <span className="bg-amber-900/50 border border-amber-700 text-amber-300 rounded px-3 py-1">{p.i}</span>
                </div>
                <p className="text-gray-400 text-sm">{p.note}</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900/30 border border-indigo-700 rounded-xl p-4 space-y-2">
            <p className="text-indigo-300 font-semibold">Exercice progressif</p>
            <ol className="text-sm text-gray-300 space-y-1 list-decimal ml-4">
              <li>Apprenez l'arpège <strong className="text-white">Cm7</strong> dans la position 1 (manche)</li>
              <li>Apprenez l'arpège <strong className="text-white">F7</strong> dans la même zone du manche</li>
              <li>Enchaînez les deux sans pause, puis ajoutez <strong className="text-white">Bb△7</strong></li>
              <li>Répétez sur la cadence mineure : Am7b5 → D7 → Gm</li>
              <li>Jouez sur le playback du standard (YouTube : "Autumn Leaves backing track")</li>
            </ol>
          </div>
        </div>

        {/* Melody notes */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-xl font-bold">La mélodie et les arpèges</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            La mélodie d'Autumn Leaves est presque entièrement composée de notes d'arpèges.
            Écouter et jouer la mélodie <strong className="text-white">en sachant de quel accord elle provient</strong> est
            l'un des meilleurs exercices d'oreille du jazz.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-2">
            <p className="text-gray-400">Les 4 premières mesures (mélodie simplifiée) :</p>
            <p className="font-mono text-gray-300">
              <span className="text-blue-300">C D Eb F</span>
              {' '}|{' '}
              <span className="text-red-300">G A Bb C</span>
              {' '}|{' '}
              <span className="text-amber-300">D Eb F G</span>
              {' '}|{' '}
              <span className="text-gray-400">Eb D C Bb</span>
            </p>
            <p className="text-gray-500 text-xs">
              Chaque groupe de notes correspond aux notes de l'arpège de l'accord en cours.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Visualiser les arpèges →
          </Link>
          <Link href="/tuto/deux-cinq-un"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Cours II–V–I
          </Link>
        </div>
      </div>
    </main>
  );
}
