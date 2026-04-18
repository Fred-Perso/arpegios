import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

// SVG schema: half-step grid showing a major scale with interval labels
function IntervalSchema() {
  const W = 680; const H = 160;
  const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','C'];
  const inScale = [true,false,true,false,true,true,false,true,false,true,false,true,true];
  const cellW = W / 12; const y = 60; const r = 16;
  const colors = ['#f97316','#6b7280','#3b82f6','#6b7280','#22c55e','#a855f7','#6b7280','#f97316','#6b7280','#3b82f6','#6b7280','#22c55e','#f97316'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" style={{minWidth:320}}>
      {/* Chromatic grid */}
      {notes.map((n,i)=>{
        const x = i * cellW + cellW/2;
        const inS = inScale[i];
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={inS ? colors[i] : '#1f2937'} stroke={inS?'white':'#374151'} strokeWidth={1.5}/>
            <text x={x} y={y+5} textAnchor="middle" fontSize={10} fontWeight="bold" fill={inS?'white':'#6b7280'}>{n}</text>
          </g>
        );
      })}
      {/* Interval labels between scale notes */}
      {[
        {from:0,to:2,label:'M2',color:'#60a5fa'},{from:2,to:4,label:'M2',color:'#60a5fa'},
        {from:4,to:5,label:'m2',color:'#f87171'},{from:5,to:7,label:'M2',color:'#60a5fa'},
        {from:7,to:9,label:'M2',color:'#60a5fa'},{from:9,to:11,label:'M2',color:'#60a5fa'},
        {from:11,to:12,label:'m2',color:'#f87171'},
      ].map((iv,i)=>{
        const x1 = iv.from*cellW+cellW/2+r+2; const x2 = iv.to*cellW+cellW/2-r-2;
        const mx = (x1+x2)/2;
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={iv.color} strokeWidth={2}/>
            <polygon points={`${x2},${y} ${x2-6},${y-4} ${x2-6},${y+4}`} fill={iv.color}/>
            <text x={mx} y={y-22} textAnchor="middle" fontSize={9} fill={iv.color} fontWeight="bold">{iv.label}</text>
          </g>
        );
      })}
      {/* Degree numbers */}
      {[0,2,4,5,7,9,11,12].map((pos,i)=>(
        <text key={i} x={pos*cellW+cellW/2} y={y+36} textAnchor="middle" fontSize={9} fill="#9ca3af">
          {['1','2','3','4','5','6','7','8'][i]}
        </text>
      ))}
      <text x={W/2} y={H-4} textAnchor="middle" fontSize={9} fill="#6b7280">Gamme de Do majeur — les 12 demi-tons chromatiques</text>
    </svg>
  );
}

// SVG schema: chord construction by stacking thirds
function ChordStackSchema({ type, label, notes, intervals }: {
  type: string; label: string;
  notes: string[]; intervals: string[];
}) {
  const colors = ['#f97316','#3b82f6','#22c55e','#a855f7'];
  const W = 200; const H = 220; const cx = 100;
  const ys = [30, 80, 130, 180];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <text x={cx} y={14} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#e5e7eb">{label}</text>
      {notes.map((n,i)=>(
        <g key={i}>
          {i<3 && (
            <>
              <line x1={cx} y1={ys[i]+18} x2={cx} y2={ys[i+1]-18} stroke="#4b5563" strokeWidth={1.5} strokeDasharray="3 2"/>
              <text x={cx+18} y={(ys[i]+ys[i+1])/2+4} fontSize={9} fill="#9ca3af">{intervals[i]}</text>
            </>
          )}
          <circle cx={cx} cy={ys[i]} r={16} fill={colors[i]} stroke="white" strokeWidth={1.5}/>
          <text x={cx} y={ys[i]+4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="white">{n}</text>
        </g>
      ))}
    </svg>
  );
}

export default function IntervallesPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Les intervalles et la construction des accords à 4 sons</h1>
          <p className="text-gray-400 mt-1">De la gamme à l'accord — comprendre la logique</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">1. Qu'est-ce qu'un intervalle ?</h2>
          <p className="text-gray-300 leading-relaxed">
            Un <strong className="text-white">intervalle</strong> est la distance en demi-tons entre deux notes.
            C'est le langage de base de toute la théorie musicale. Sur le manche de guitare,
            <strong className="text-white"> chaque case = 1 demi-ton</strong>.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
                  <th className="text-left py-2 pr-4">Intervalle</th>
                  <th className="text-left py-2 pr-4">Demi-tons</th>
                  <th className="text-left py-2 pr-4">Symbole</th>
                  <th className="text-left py-2">Exemple (do C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {[
                  ['Unisson',         '0',  '1',    'C – C'],
                  ['Seconde mineure', '1',  'b2',   'C – Db'],
                  ['Seconde majeure', '2',  '2',    'C – D'],
                  ['Tierce mineure',  '3',  'b3',   'C – Eb'],
                  ['Tierce majeure',  '4',  '3',    'C – E'],
                  ['Quarte juste',    '5',  '4',    'C – F'],
                  ['Triton',          '6',  'b5/#4','C – Gb'],
                  ['Quinte juste',    '7',  '5',    'C – G'],
                  ['Sixte mineure',   '8',  'b6',   'C – Ab'],
                  ['Sixte majeure',   '9',  '6',    'C – A'],
                  ['Septième mineure','10', 'b7',   'C – Bb'],
                  ['Septième majeure','11', '△7',   'C – B'],
                  ['Octave',          '12', '8',    'C – C'],
                ].map(([name, st, sym, ex]) => (
                  <tr key={name}>
                    <td className="py-2 pr-4 text-white">{name}</td>
                    <td className="py-2 pr-4 font-mono text-orange-300">{st}</td>
                    <td className="py-2 pr-4 font-mono text-indigo-300">{sym}</td>
                    <td className="py-2 text-gray-400">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">2. Structure de la gamme majeure</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            La gamme majeure est construite avec un enchaînement précis de tons (M2 = 2 demi-tons) et demi-tons (m2 = 1 demi-ton).
            La formule est <strong className="text-white">T T dT T T T dT</strong> (Ton Ton demi-Ton Ton Ton Ton demi-Ton).
          </p>
          <IntervalSchema />
          <p className="text-gray-400 text-xs text-center mt-2">
            Les notes de la gamme sont en couleur — les # (notes noires) ne font pas partie de Do majeur.
          </p>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">3. Construction des accords à 4 sons : empiler des tierces</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Un accord à 4 sons (accord de septième) se construit en <strong className="text-white">empilant 3 tierces</strong> à partir d'une note :
            racine → tierce → quinte → septième. Selon le type de tierce (majeure = 4 demi-tons, mineure = 3 demi-tons),
            on obtient un accord différent.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ChordStackSchema type="Maj7"  label="C△7 (I)"  notes={['C','E','G','B']}  intervals={['T.M','T.J','T.M']}/>
            <ChordStackSchema type="m7"    label="Dm7 (II)" notes={['D','F','A','C']}  intervals={['T.m','T.J','T.m']}/>
            <ChordStackSchema type="Dom7"  label="G7  (V)"  notes={['G','B','D','F']}  intervals={['T.M','T.J','T.m']}/>
            <ChordStackSchema type="m7b5"  label="Bø7 (VII)"notes={['B','D','F','A']}  intervals={['T.m','T.d','T.M']}/>
          </div>
          <p className="text-gray-400 text-xs text-center mt-2">
            T.M = tierce majeure (4 demi-tons) · T.m = tierce mineure (3) · T.J = tierce juste* · T.d = tierce diminuée (3)
          </p>
          <p className="text-gray-500 text-xs text-center">*tierce juste n'existe pas — c'est une quinte, mais entre le 3 et le 5 on saute directement</p>
        </Box>

        {/* KEY EXPLANATION: why minor chords in a major key */}
        <Box color="bg-indigo-900/30 border border-indigo-700">
          <h2 className="text-xl font-bold text-indigo-200">⚡ La question clé : pourquoi des accords mineurs dans une tonalité majeure ?</h2>
          <p className="text-gray-300 leading-relaxed">
            C'est <strong className="text-white">la</strong> question que tout le monde se pose. La réponse tient en une phrase :
            <strong className="text-indigo-300"> ce n'est pas la tonalité qui décide si un accord est majeur ou mineur — c'est la distance entre les notes de la gamme.</strong>
          </p>
          <div className="bg-gray-900 rounded-xl p-4 space-y-3 text-sm">
            <p className="text-white font-semibold">Voyons pourquoi le II est mineur en Do majeur :</p>
            <p className="text-gray-300">
              La gamme de Do majeur : <span className="font-mono text-orange-300">C – D – E – F – G – A – B</span>
            </p>
            <p className="text-gray-300">
              On construit un accord sur <span className="text-blue-300 font-bold">Re (D)</span> en utilisant
              <strong className="text-white"> uniquement les notes de la gamme de Do</strong> (on ne choisit pas — la gamme impose ses notes).
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <span className="bg-blue-900/50 border border-blue-700 rounded px-2 py-1 text-blue-300">D <span className="text-gray-400">(racine)</span></span>
              <span className="text-gray-500">+</span>
              <span className="bg-gray-800 rounded px-2 py-1">F <span className="text-gray-400">= 3 demi-tons = tierce <strong className="text-red-400">mineure</strong></span></span>
              <span className="text-gray-500">+</span>
              <span className="bg-gray-800 rounded px-2 py-1">A <span className="text-gray-400">= 7 demi-tons = quinte juste</span></span>
              <span className="text-gray-500">+</span>
              <span className="bg-gray-800 rounded px-2 py-1">C <span className="text-gray-400">= 10 demi-tons = 7e mineure</span></span>
            </div>
            <div className="bg-indigo-900/40 rounded-lg p-3 border border-indigo-800">
              <p className="text-indigo-200 font-semibold">
                La tierce entre D et F n'est que de <strong>3 demi-tons</strong> (D→D#→E→F).
                C'est une tierce <strong>mineure</strong>. Voilà pourquoi Dm7 est mineur :
                pas parce qu'on a "décidé" de le rendre mineur, mais parce que la gamme de Do
                ne contient pas de F# (qui serait la tierce majeure de D).
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 space-y-3 text-sm mt-2">
            <p className="text-white font-semibold">Comparaison : I△7 vs II m7</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-amber-300 font-bold">C△7 (degré I — MAJEUR)</p>
                <p className="text-gray-400 font-mono text-xs">C → E : 4 demi-tons = tierce <strong className="text-green-400">majeure</strong></p>
                <p className="text-gray-400 font-mono text-xs">C – <strong className="text-green-400">E</strong> – G – B</p>
                <p className="text-gray-500 text-xs">Le E naturel est dans la gamme → accord MAJEUR</p>
              </div>
              <div className="space-y-1">
                <p className="text-blue-300 font-bold">Dm7 (degré II — MINEUR)</p>
                <p className="text-gray-400 font-mono text-xs">D → F : 3 demi-tons = tierce <strong className="text-red-400">mineure</strong></p>
                <p className="text-gray-400 font-mono text-xs">D – <strong className="text-red-400">F</strong> – A – C</p>
                <p className="text-gray-500 text-xs">Pas de F# dans Do majeur → accord MINEUR</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs pt-1 border-t border-gray-800">
              <strong className="text-white">Règle :</strong> c'est le 3e demi-ton de l'accord qui décide.
              Tierce majeure (4 demi-tons) → accord majeur. Tierce mineure (3 demi-tons) → accord mineur.
              La gamme impose les distances — et c'est pour ça que certains degrés "deviennent" mineurs.
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 text-sm">
            <p className="text-white font-semibold mb-2">Récapitulatif pour Do majeur :</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                {deg:'I – C',  third:'C→E = 4',  type:'MAJEUR', color:'text-amber-300'},
                {deg:'II – D', third:'D→F = 3',  type:'mineur', color:'text-blue-300'},
                {deg:'III – E',third:'E→G = 3',  type:'mineur', color:'text-blue-300'},
                {deg:'IV – F', third:'F→A = 4',  type:'MAJEUR', color:'text-amber-300'},
                {deg:'V – G',  third:'G→B = 4',  type:'MAJEUR', color:'text-red-300'},
                {deg:'VI – A', third:'A→C = 3',  type:'mineur', color:'text-blue-300'},
                {deg:'VII – B',third:'B→D = 3',  type:'dim.', color:'text-purple-300'},
              ].map(r=>(
                <div key={r.deg} className="bg-gray-800 rounded p-2">
                  <p className={`font-bold ${r.color}`}>{r.deg}</p>
                  <p className="text-gray-500">{r.third} demi-t.</p>
                  <p className={r.color}>{r.type}</p>
                </div>
              ))}
            </div>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">4. Les 4 types d'accords et leurs intervalles</h2>
          <div className="space-y-3 text-sm">
            {[
              { sym:'△7',   name:'Major 7',        formula:'1 – 3 – 5 – △7',     semitones:'0 – 4 – 7 – 11', desc:'Tierce M + Quinte J + 7e M. Son lumineux, stable.',    color:'text-amber-300'},
              { sym:'m7',   name:'Minor 7',        formula:'1 – b3 – 5 – b7',    semitones:'0 – 3 – 7 – 10', desc:'Tierce m + Quinte J + 7e m. Son doux, mélancolique.',   color:'text-blue-300'},
              { sym:'7',    name:'Dominant 7',     formula:'1 – 3 – 5 – b7',     semitones:'0 – 4 – 7 – 10', desc:'Tierce M + Quinte J + 7e m. Tension, résout sur le I.',  color:'text-red-300'},
              { sym:'ø7',   name:'Minor 7 b5',     formula:'1 – b3 – b5 – b7',   semitones:'0 – 3 – 6 – 10', desc:'Tierce m + 5te dim + 7e m. Semi-diminué, couleur sombre.',color:'text-purple-300'},
              { sym:'m△7',  name:'Minor/Major 7',  formula:'1 – b3 – 5 – △7',    semitones:'0 – 3 – 7 – 11', desc:'Tierce m + 5te J + 7e M. Couleur "James Bond".',         color:'text-teal-300'},
              { sym:'△7#5', name:'Major 7 #5',     formula:'1 – 3 – #5 – △7',    semitones:'0 – 4 – 8 – 11', desc:'Tierce M + 5te aug + 7e M. Son flottant, lydien.',       color:'text-cyan-300'},
              { sym:'o7',   name:'Diminished 7',   formula:'1 – b3 – b5 – bb7',  semitones:'0 – 3 – 6 – 9',  desc:'4 tierces mineures égales. Accord symétrique, instable.', color:'text-rose-300'},
            ].map(t=>(
              <div key={t.sym} className="bg-gray-900 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <span className={`text-2xl font-bold w-16 shrink-0 ${t.color}`}>{t.sym}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="font-mono text-xs text-gray-400">{t.formula} <span className="ml-3 text-gray-600">({t.semitones})</span></p>
                </div>
                <p className="text-gray-400 text-xs sm:w-64">{t.desc}</p>
              </div>
            ))}
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">5. Les 7 accords de la gamme majeure</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            En appliquant ce principe sur chaque degré de la gamme de <strong className="text-white">Do majeur</strong>,
            en n'utilisant que les notes de cette gamme, on obtient :
          </p>
          <div className="bg-gray-900 rounded-xl p-4 space-y-2 font-mono text-sm">
            {[
              { deg:'I',   root:'C', chord:'C△7',  notes:'C – E – G – B',   color:'text-amber-300'},
              { deg:'II',  root:'D', chord:'Dm7',   notes:'D – F – A – C',   color:'text-blue-300'},
              { deg:'III', root:'E', chord:'Em7',   notes:'E – G – B – D',   color:'text-blue-300'},
              { deg:'IV',  root:'F', chord:'F△7',   notes:'F – A – C – E',   color:'text-amber-300'},
              { deg:'V',   root:'G', chord:'G7',    notes:'G – B – D – F',   color:'text-red-300'},
              { deg:'VI',  root:'A', chord:'Am7',   notes:'A – C – E – G',   color:'text-blue-300'},
              { deg:'VII', root:'B', chord:'Bø7',   notes:'B – D – F – A',   color:'text-purple-300'},
            ].map(r=>(
              <div key={r.deg} className="flex items-center gap-3">
                <span className="text-gray-500 w-8">{r.deg}</span>
                <span className={`font-bold w-16 ${r.color}`}>{r.chord}</span>
                <span className="text-gray-400 text-xs">{r.notes}</span>
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
