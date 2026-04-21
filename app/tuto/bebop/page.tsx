import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

function Tag({ children, color = 'bg-gray-700 text-gray-300' }: { children: React.ReactNode; color?: string }) {
  return <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{children}</span>;
}

/* ── Scale diagram: shows 8 notes in a row, chromatic note highlighted ── */
function BebopScaleSVG({ notes, label, chromaIdx }: {
  notes: { n: string; deg: string; isChord: boolean; isChroma: boolean }[];
  label: string;
  chromaIdx: number;
}) {
  const W = 580; const H = 90;
  const PAD = 20; const cellW = (W - PAD * 2) / notes.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto">
      {/* Track */}
      <rect x={PAD} y={36} width={W - PAD * 2} height={2} fill="#374151" rx={1}/>
      {notes.map((nt, i) => {
        const cx = PAD + i * cellW + cellW / 2;
        const isChroma = nt.isChroma;
        const isChord  = nt.isChord;
        const fill  = isChroma ? '#a855f7' : isChord  ? '#f97316' : '#3b82f6';
        const stroke= isChroma ? '#c084fc' : isChord  ? '#fb923c' : '#60a5fa';
        return (
          <g key={i}>
            <circle cx={cx} cy={37} r={isChroma ? 12 : 14}
              fill={fill + '25'} stroke={stroke} strokeWidth={isChroma ? 1.5 : 2}
              strokeDasharray={isChroma ? '4 2' : 'none'}/>
            <text x={cx} y={41} textAnchor="middle" fontSize={isChroma ? 11 : 13}
              fontWeight="800" fill={isChroma ? '#c084fc' : 'white'}>{nt.n}</text>
            <text x={cx} y={62} textAnchor="middle" fontSize={10} fill={isChroma ? '#7c3aed' : '#6b7280'}>{nt.deg}</text>
            {isChroma && (
              <text x={cx} y={80} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight="600">PASS</text>
            )}
            {isChord && (
              <circle cx={cx} cy={18} r={3} fill="#f97316"/>
            )}
          </g>
        );
      })}
      <text x={PAD} y={15} fontSize={10} fill="#f97316" fontWeight="700">● = note d'accord</text>
      <text x={W - PAD} y={15} textAnchor="end" fontSize={10} fill="#a855f7" fontWeight="700">◌ = note de passage</text>
    </svg>
  );
}

/* ── Enclosure diagram ── */
function EnclosureSVG({ type }: { type: 'chroma' | 'diato' | 'mixed' }) {
  const W = 380; const H = 100;
  const configs = {
    chroma: {
      notes: [
        { n: 'C#', y: 40, color: '#6b7280', label: '½ ton au-dessus' },
        { n: 'Bb', y: 68, color: '#6b7280', label: '½ ton en-dessous' },
        { n: 'B',  y: 54, color: '#f97316', label: 'CIBLE' },
      ],
      order: [0, 1, 2],
      title: 'Encadrement chromatique',
    },
    diato: {
      notes: [
        { n: 'C',  y: 40, color: '#6b7280', label: 'ton au-dessus' },
        { n: 'A',  y: 68, color: '#6b7280', label: 'ton en-dessous' },
        { n: 'B',  y: 54, color: '#f97316', label: 'CIBLE' },
      ],
      order: [0, 1, 2],
      title: 'Encadrement diatonique',
    },
    mixed: {
      notes: [
        { n: 'C',  y: 40, color: '#6b7280', label: 'diat. dessus' },
        { n: 'Bb', y: 68, color: '#6b7280', label: 'chrom. dessous' },
        { n: 'B',  y: 54, color: '#f97316', label: 'CIBLE' },
      ],
      order: [0, 1, 2],
      title: 'Mixte (diat. + chrom.)',
    },
  };
  const cfg = configs[type];
  const xs = [60, 180, 300];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm mx-auto">
      <text x={W/2} y={14} textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight="700">{cfg.title}</text>
      {cfg.order.map((ni, i) => {
        const nt = cfg.notes[ni];
        const x = xs[i];
        const isTarget = nt.color === '#f97316';
        return (
          <g key={i}>
            {i < 2 && (
              <line x1={xs[i] + 22} y1={cfg.notes[cfg.order[i]].y}
                x2={xs[i+1] - 22} y2={cfg.notes[cfg.order[i+1]].y}
                stroke="#374151" strokeWidth={1.5} markerEnd="url(#arr)"/>
            )}
            <circle cx={x} cy={nt.y} r={isTarget ? 18 : 16}
              fill={isTarget ? '#f9731625' : '#1f2937'}
              stroke={isTarget ? '#f97316' : '#4b5563'} strokeWidth={isTarget ? 2.5 : 1.5}/>
            <text x={x} y={nt.y + 5} textAnchor="middle" fontSize={isTarget ? 13 : 11}
              fontWeight="800" fill={isTarget ? '#f97316' : '#9ca3af'}>{nt.n}</text>
            <text x={x} y={isTarget ? nt.y + 30 : nt.y + 28} textAnchor="middle"
              fontSize={8} fill={isTarget ? '#f97316' : '#6b7280'}>{nt.label}</text>
          </g>
        );
      })}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#4b5563"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ── II-V-I bebop line with beat annotations ── */
function IIVIBebopSVG() {
  const W = 640; const H = 130;
  const beats = [
    // Bar 1: Dm7
    { x: 30,  note: 'D',  deg: 'R',   beat: '1',  color: '#f97316', chord: 'Dm7' },
    { x: 95,  note: 'E',  deg: '2',   beat: '2',  color: '#6b7280', chord: '' },
    { x: 160, note: 'F',  deg: '♭3',  beat: '3',  color: '#3b82f6', chord: '' },
    { x: 225, note: 'C',  deg: '♭7',  beat: '4',  color: '#a855f7', chord: '' },
    // Bar 2: G7
    { x: 310, note: 'B',  deg: '3',   beat: '1',  color: '#f97316', chord: 'G7' },
    { x: 375, note: 'Bb', deg: '♭7',  beat: '2',  color: '#6b7280', chord: '' },
    { x: 440, note: 'A',  deg: '9',   beat: '3',  color: '#6b7280', chord: '' },
    { x: 505, note: 'Ab', deg: '♭9',  beat: '4',  color: '#a855f7', chord: '' },
    // Bar 3: CMaj7
    { x: 590, note: 'G',  deg: '5',   beat: '1',  color: '#f97316', chord: 'C△7' },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto">
      {/* Bar lines */}
      <line x1={280} y1={20} x2={280} y2={90} stroke="#374151" strokeWidth={1.5}/>
      <line x1={560} y1={20} x2={560} y2={90} stroke="#374151" strokeWidth={1.5}/>
      {/* Chord labels */}
      {[{ x: 120, label: 'Dm7', color: '#3b82f6' }, { x: 400, label: 'G7', color: '#ef4444' }, { x: 590, label: 'C△7', color: '#f97316' }].map(c => (
        <text key={c.label} x={c.x} y={16} textAnchor="middle" fontSize={13} fontWeight="800" fill={c.color}>{c.label}</text>
      ))}
      {/* Connecting line */}
      {beats.slice(0, -1).map((b, i) => {
        const next = beats[i + 1];
        if (b.x > 250 && next.x < 300) return null;
        if (b.x > 530 && next.x < 560) return null;
        return <line key={i} x1={b.x + 14} y1={55} x2={next.x - 14} y2={55} stroke="#374151" strokeWidth={1} strokeDasharray="3 2"/>;
      })}
      {beats.map((b, i) => {
        const isDown = b.beat === '1' || b.beat === '3';
        return (
          <g key={i}>
            <circle cx={b.x} cy={55} r={b.beat === '1' ? 16 : 13}
              fill={b.color + '20'} stroke={b.color} strokeWidth={b.beat === '1' ? 2.5 : 1.5}/>
            <text x={b.x} y={59} textAnchor="middle" fontSize={11} fontWeight="800" fill={b.color === '#6b7280' ? '#9ca3af' : b.color}>{b.note}</text>
            <text x={b.x} y={80} textAnchor="middle" fontSize={9} fill={b.beat === '1' ? '#f97316' : '#4b5563'}>{b.beat}</text>
            <text x={b.x} y={96} textAnchor="middle" fontSize={8} fill="#6b7280">{b.deg}</text>
            {isDown && b.beat === '1' && (
              <rect x={b.x - 8} y={76} width={16} height={12} rx={3} fill="none" stroke="#f97316" strokeWidth={1} opacity={0.5}/>
            )}
          </g>
        );
      })}
      <text x={10} y={112} fontSize={9} fill="#f97316">■ Temps 1</text>
      <text x={80} y={112} fontSize={9} fill="#6b7280">= accord correspondant en temps fort</text>
    </svg>
  );
}

/* ── Charlie Parker "lick" pattern ── */
function ParkerLickSVG() {
  const steps = [
    { n: 'G', color: '#f97316', label: 'R', beat: '1' },
    { n: 'F', color: '#6b7280', label: '♭7', beat: '+' },
    { n: 'E', color: '#3b82f6', label: '6', beat: '2' },
    { n: 'D', color: '#6b7280', label: '5', beat: '+' },
    { n: 'F', color: '#a855f7', label: '♭7', beat: '3' },
    { n: 'E', color: '#6b7280', label: '6', beat: '+' },
    { n: 'D', color: '#3b82f6', label: '5', beat: '4' },
    { n: 'B', color: '#f97316', label: '3', beat: '+' },
  ];
  const W = 500; const H = 80;
  const cellW = (W - 40) / steps.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      <text x={W/2} y={12} textAnchor="middle" fontSize={9} fill="#6b7280">Exemple sur G7 · mesure descendante caractéristique</text>
      {steps.map((s, i) => {
        const cx = 20 + i * cellW + cellW / 2;
        const isDown = s.beat !== '+';
        return (
          <g key={i}>
            {i > 0 && (
              <line x1={cx - cellW + 14} y1={42} x2={cx - 14} y2={42}
                stroke="#1f2937" strokeWidth={1}/>
            )}
            <circle cx={cx} cy={42} r={isDown ? 14 : 11}
              fill={s.color + '20'} stroke={s.color} strokeWidth={isDown ? 2 : 1.5}/>
            <text x={cx} y={46} textAnchor="middle" fontSize={isDown ? 12 : 10}
              fontWeight="700" fill={s.color === '#6b7280' ? '#9ca3af' : s.color}>{s.n}</text>
            <text x={cx} y={64} textAnchor="middle" fontSize={8}
              fill={isDown ? '#9ca3af' : '#4b5563'}>{s.beat}</text>
            <text x={cx} y={75} textAnchor="middle" fontSize={7} fill="#4b5563">{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Guide tones movement SVG ── */
function GuideTonesProgressionSVG() {
  type Chord = { name: string; color: string; third: string; seven: string };
  const chords: Chord[] = [
    { name: 'Dm7',  color: '#3b82f6', third: 'F',  seven: 'C'  },
    { name: 'G7',   color: '#ef4444', third: 'B',  seven: 'F'  },
    { name: 'C△7',  color: '#f97316', third: 'E',  seven: 'B'  },
  ];
  const W = 480; const H = 110;
  const colW = W / chords.length;

  const yPos: Record<string, number> = { B: 30, C: 38, E: 50, F: 60, G: 30 };
  const thirdY = (n: string) => ({ F: 35, B: 65, E: 50 })[n] ?? 50;
  const sevenY  = (n: string) => ({ C: 70, F: 35, B: 65 })[n] ?? 70;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      {chords.map((ch, i) => {
        const cx = i * colW + colW / 2;
        const t3 = thirdY(ch.third);
        const t7 = sevenY(ch.seven);
        return (
          <g key={i}>
            <text x={cx} y={14} textAnchor="middle" fontSize={13} fontWeight="800" fill={ch.color}>{ch.name}</text>
            {/* 3rd */}
            <circle cx={cx - 20} cy={t3} r={14} fill={ch.color + '25'} stroke={ch.color} strokeWidth={2}/>
            <text x={cx - 20} y={t3 + 4} textAnchor="middle" fontSize={11} fontWeight="800" fill={ch.color}>{ch.third}</text>
            <text x={cx - 20} y={t3 + 18} textAnchor="middle" fontSize={8} fill="#6b7280">3ce</text>
            {/* 7th */}
            <circle cx={cx + 20} cy={t7} r={14} fill="#a855f720" stroke="#a855f7" strokeWidth={2}/>
            <text x={cx + 20} y={t7 + 4} textAnchor="middle" fontSize={11} fontWeight="800" fill="#c084fc">{ch.seven}</text>
            <text x={cx + 20} y={t7 + 18} textAnchor="middle" fontSize={8} fill="#6b7280">7e</text>
            {/* Connection to next */}
            {i < chords.length - 1 && (() => {
              const nx = (i + 1) * colW + colW / 2;
              const nt3 = thirdY(chords[i+1].third);
              const nt7 = sevenY(chords[i+1].seven);
              return (
                <>
                  <line x1={cx - 6} y1={t3} x2={nx - 34} y2={nt3}
                    stroke={ch.color} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.6}/>
                  <line x1={cx + 34} y1={t7} x2={nx + 6} y2={nt7}
                    stroke="#a855f7" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.6}/>
                </>
              );
            })()}
          </g>
        );
      })}
      <text x={W/2} y={108} textAnchor="middle" fontSize={9} fill="#6b7280">Mouvement des guide tones (3ce + 7e) dans un II–V–I en Do</text>
    </svg>
  );
}

/* ── Bebop rhythmic pattern ── */
function RhythmicGridSVG() {
  const W = 560; const H = 70;
  const bars = 2;
  const beats = 8;
  const cellW = (W - 40) / beats;
  const cells = [
    { label: '1',  isDown: true,  hasNote: true,  note: 'G',  type: 'chord' },
    { label: '+',  isDown: false, hasNote: true,  note: 'F',  type: 'pass' },
    { label: '2',  isDown: true,  hasNote: true,  note: 'E',  type: 'chord' },
    { label: '+',  isDown: false, hasNote: true,  note: 'D',  type: 'pass' },
    { label: '3',  isDown: true,  hasNote: true,  note: 'F',  type: 'approach' },
    { label: '+',  isDown: false, hasNote: true,  note: 'E',  type: 'pass' },
    { label: '4',  isDown: true,  hasNote: true,  note: 'D',  type: 'chord' },
    { label: '+',  isDown: false, hasNote: true,  note: 'B',  type: 'chord' },
  ];
  const typeColor: Record<string, string> = { chord: '#f97316', pass: '#3b82f6', approach: '#22c55e' };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto">
      {/* Beat grid */}
      {cells.map((c, i) => {
        const x = 20 + i * cellW;
        const color = typeColor[c.type];
        return (
          <g key={i}>
            <rect x={x} y={20} width={cellW - 2} height={28}
              rx={4} fill={c.isDown ? color + '20' : '#111827'}
              stroke={c.isDown ? color : '#1f2937'} strokeWidth={c.isDown ? 1.5 : 1}/>
            <text x={x + cellW/2 - 1} y={37} textAnchor="middle"
              fontSize={12} fontWeight="700" fill={c.hasNote ? (c.isDown ? color : '#6b7280') : '#2d3748'}>{c.note}</text>
            <text x={x + cellW/2 - 1} y={58} textAnchor="middle"
              fontSize={9} fill={c.isDown ? '#9ca3af' : '#374151'}>{c.label}</text>
          </g>
        );
      })}
      <text x={20} y={14} fontSize={9} fill="#f97316">■ note d'accord</text>
      <text x={160} y={14} fontSize={9} fill="#3b82f6">■ passage</text>
      <text x={255} y={14} fontSize={9} fill="#22c55e">■ approche</text>
    </svg>
  );
}

/* ── Chromatic approach pattern ── */
function ApproachNotesSVG() {
  const W = 480; const H = 100;
  const types = [
    { label: 'Approche chr. par le bas', notes: ['Bb', 'B'], colors: ['#6b7280', '#f97316'], arrows: ['→'] },
    { label: 'Approche chr. par le haut', notes: ['C#', 'C'], colors: ['#6b7280', '#f97316'], arrows: ['→'] },
    { label: 'Double approche', notes: ['Db', 'A#', 'B'], colors: ['#6b7280', '#6b7280', '#f97316'], arrows: ['→', '→'] },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg mx-auto">
      {types.map((t, ti) => {
        const y = 20 + ti * 28;
        return (
          <g key={ti}>
            <text x={10} y={y + 4} fontSize={9} fill="#6b7280" fontWeight="600">{t.label}</text>
            {t.notes.map((n, ni) => {
              const x = 200 + ni * 70;
              const isTarget = ni === t.notes.length - 1;
              return (
                <g key={ni}>
                  {ni > 0 && (
                    <text x={x - 28} y={y + 5} textAnchor="middle" fontSize={12} fill="#374151">→</text>
                  )}
                  <circle cx={x} cy={y} r={isTarget ? 13 : 11}
                    fill={t.colors[ni] + '25'} stroke={t.colors[ni]}
                    strokeWidth={isTarget ? 2.5 : 1.5}/>
                  <text x={x} y={y + 4} textAnchor="middle" fontSize={isTarget ? 12 : 10}
                    fontWeight="700" fill={isTarget ? '#f97316' : '#9ca3af'}>{n}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function BebopPage() {
  const dominantNotes = [
    { n: 'C',  deg: '1',  isChord: true,  isChroma: false },
    { n: 'D',  deg: '2',  isChord: false, isChroma: false },
    { n: 'E',  deg: '3',  isChord: true,  isChroma: false },
    { n: 'F',  deg: '4',  isChord: false, isChroma: false },
    { n: 'G',  deg: '5',  isChord: true,  isChroma: false },
    { n: 'A',  deg: '6',  isChord: false, isChroma: false },
    { n: 'Bb', deg: '♭7', isChord: true,  isChroma: false },
    { n: 'B',  deg: '△7', isChord: false, isChroma: true  },
    { n: 'C',  deg: '1',  isChord: true,  isChroma: false },
  ];
  const majorNotes = [
    { n: 'C',  deg: '1',  isChord: true,  isChroma: false },
    { n: 'D',  deg: '2',  isChord: false, isChroma: false },
    { n: 'E',  deg: '3',  isChord: true,  isChroma: false },
    { n: 'F',  deg: '4',  isChord: false, isChroma: false },
    { n: 'G',  deg: '5',  isChord: true,  isChroma: false },
    { n: 'G#', deg: '#5', isChord: false, isChroma: true  },
    { n: 'A',  deg: '6',  isChord: false, isChroma: false },
    { n: 'B',  deg: '7',  isChord: true,  isChroma: false },
    { n: 'C',  deg: '1',  isChord: true,  isChroma: false },
  ];
  const dorianNotes = [
    { n: 'C',  deg: '1',  isChord: true,  isChroma: false },
    { n: 'D',  deg: '2',  isChord: false, isChroma: false },
    { n: 'Eb', deg: '♭3', isChord: true,  isChroma: false },
    { n: 'F',  deg: '4',  isChord: false, isChroma: false },
    { n: 'G',  deg: '5',  isChord: true,  isChroma: false },
    { n: 'A',  deg: '6',  isChord: false, isChroma: false },
    { n: 'Bb', deg: '♭7', isChord: true,  isChroma: false },
    { n: 'B',  deg: '△7', isChord: false, isChroma: true  },
    { n: 'C',  deg: '1',  isChord: true,  isChroma: false },
  ];

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8 max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <Link href="/tuto" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Théorie</Link>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <h1 className="text-3xl font-black tracking-tight">Le Style Bebop</h1>
          <span className="bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Avancé</span>
        </div>
        <p className="text-gray-400 mt-2 leading-relaxed">
          Naissance d'un langage : vocabulaire mélodique, gammes bebop, encadrements, lignes de croches continues. Tout ce qui fait sonner "jazz moderne".
        </p>
      </div>

      {/* ── 1. CONTEXTE HISTORIQUE ── */}
      <Box color="bg-gray-800/60">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">🎺 Naissance du bebop <span className="text-sm font-normal text-gray-500">(1940–1955)</span></h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Le bebop naît au début des années 1940 à New York, dans les sessions tardives du <strong className="text-white">Minton's Playhouse</strong>.
          Charlie Parker (alto), Dizzy Gillespie (trompette), Thelonious Monk (piano) et Kenny Clarke (batterie) y construisent un langage radicalement nouveau :
          tempos vertigineux, harmonies enrichies, mélodies chromatiques complexes. La réaction contre le swing commercial, joué par de grands orchestres.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {[
            { name: 'Charlie Parker', inst: 'Alto sax', color: 'border-orange-700/50 bg-orange-900/20' },
            { name: 'Dizzy Gillespie', inst: 'Trompette', color: 'border-blue-700/50 bg-blue-900/20' },
            { name: 'Thelonious Monk', inst: 'Piano', color: 'border-purple-700/50 bg-purple-900/20' },
            { name: 'Wes Montgomery', inst: 'Guitare', color: 'border-green-700/50 bg-green-900/20' },
          ].map(p => (
            <div key={p.name} className={`rounded-xl border p-3 text-center ${p.color}`}>
              <p className="text-white font-bold text-xs">{p.name}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{p.inst}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-orange-400">Caractéristiques fondamentales :</strong> lignes de croches sans fin · chromatisme dense · arpèges brisés ·
            substitutions harmoniques · ornements rapides · tempos entre ♩=200 et ♩=320 ·
            forms standard (AABA, ABAC) joués à vitesse extrême.
          </p>
        </div>
      </Box>

      {/* ── 2. LES GAMMES BEBOP ── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Les 3 gammes bebop</h2>
        <Box color="bg-gray-800">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-orange-400 text-base">Gamme bebop dominante</h3>
              <p className="text-xs text-gray-500 mt-0.5">La plus utilisée · sur tout accord de dominante</p>
            </div>
            <Tag color="bg-orange-900/50 text-orange-300">La plus importante</Tag>
          </div>
          <BebopScaleSVG notes={dominantNotes} label="C dominant bebop" chromaIdx={7}/>
          <div className="bg-gray-900/60 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-white">Pourquoi ça marche ?</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Une gamme mixolydienne normale a 7 notes. En jouant des croches, les notes d'accord tombent aléatoirement sur les temps forts ou faibles.
              En ajoutant le <strong className="text-purple-400">△7 chromatique</strong> entre la ♭7 et l'octave,
              on obtient <strong className="text-orange-400">8 notes</strong> — exactement une mesure de croches.
              Si tu commences sur une note d'accord au temps 1, <strong className="text-white">toutes les notes d'accord tomberont sur les temps forts (1, 2, 3, 4)</strong>.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-orange-900/40 text-orange-300 border border-orange-800/50 px-2 py-1 rounded-lg">Temps forts : R · 3 · 5 · ♭7</span>
              <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-lg">Temps faibles : 2 · 4 · 6 · △7</span>
            </div>
          </div>
        </Box>

        <Box color="bg-gray-800">
          <div>
            <h3 className="font-bold text-blue-400 text-base">Gamme bebop majeure</h3>
            <p className="text-xs text-gray-500 mt-0.5">Sur les accords Maj7 · gamme majeure + #5 chromatique</p>
          </div>
          <BebopScaleSVG notes={majorNotes} label="C major bebop" chromaIdx={5}/>
          <p className="text-sm text-gray-300 leading-relaxed">
            La gamme majeure de 7 notes + un <strong className="text-purple-400">#5 chromatique</strong> entre la 5te et la 6te.
            Même logique : 8 notes, notes d'accord sur les temps forts lorsqu'on part du degré 1 ou 5.
          </p>
        </Box>

        <Box color="bg-gray-800">
          <div>
            <h3 className="font-bold text-teal-400 text-base">Gamme bebop mineure (Dorien bebop)</h3>
            <p className="text-xs text-gray-500 mt-0.5">Sur les accords m7 · dorien + △7 chromatique</p>
          </div>
          <BebopScaleSVG notes={dorianNotes} label="C dorian bebop" chromaIdx={7}/>
          <p className="text-sm text-gray-300 leading-relaxed">
            Le mode dorien (gamme naturelle la plus utilisée en jazz pour les Im7 et IIm7) augmenté du <strong className="text-purple-400">△7 chromatique</strong>.
            Très présente dans les lignes II–V–I : jouer la gamme bebop mineure sur le IIm7 avant de résoudre.
          </p>
        </Box>
      </div>

      {/* ── 3. GUIDE TONES ── */}
      <Box color="bg-gray-800">
        <h2 className="text-xl font-bold text-white">Les Guide Tones</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          La <strong className="text-blue-400">tierce</strong> et la <strong className="text-purple-400">septième</strong> d'un accord définissent son identité sonore :
          majeur/mineur, tension/résolution. Dans une ligne bebop, le jazzman <em>cible</em> ces deux notes à chaque changement d'accord.
          Observe comment elles se déplacent par demi-ton ou ton dans un II–V–I :
        </p>
        <GuideTonesProgressionSVG/>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {[
            { chord: 'Dm7', third: 'F', seven: 'C', note: 'Diatonique' },
            { chord: 'G7',  third: 'B', seven: 'F', note: 'La 7e de Dm7 (C) → 3ce de G7 (B) : ½ ton ↓' },
            { chord: 'C△7', third: 'E', seven: 'B', note: 'La 3ce de G7 (B) → 7e de C△7 (B) : même note !' },
          ].map(g => (
            <div key={g.chord} className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/40">
              <p className="text-sm font-bold text-white">{g.chord}</p>
              <p className="text-[11px] text-blue-400">3ce : <strong>{g.third}</strong></p>
              <p className="text-[11px] text-purple-400">7e : <strong>{g.seven}</strong></p>
              <p className="text-[10px] text-gray-500 mt-1">{g.note}</p>
            </div>
          ))}
        </div>
      </Box>

      {/* ── 4. ENCADREMENTS (ENCLOSURES) ── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Les Encadrements <span className="text-gray-500 font-normal text-base">(Enclosures)</span></h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          L'encadrement est la technique bebop la plus caractéristique. Au lieu d'atteindre directement une note cible,
          on "encadre" cette note en passant d'abord par une note au-dessus puis en-dessous (ou l'inverse) avant de résoudre.
          Crée une tension et un élan mélodique irrésistibles.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Box color="bg-gray-800">
            <EnclosureSVG type="chroma"/>
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Les deux notes d'encadrement sont des demi-tons chromatiques. Le plus tendu.
            </p>
          </Box>
          <Box color="bg-gray-800">
            <EnclosureSVG type="diato"/>
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Les deux notes appartiennent à la gamme. Le plus "inside".
            </p>
          </Box>
          <Box color="bg-gray-800">
            <EnclosureSVG type="mixed"/>
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Note diatonique au-dessus, chromatique en-dessous. Le plus utilisé par Parker.
            </p>
          </Box>
        </div>
        <Box color="bg-gray-800/60 border border-orange-800/30">
          <p className="text-sm font-semibold text-orange-400">Règle d'or des encadrements</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            L'encadrement doit toujours résoudre sur un <strong className="text-white">temps fort</strong> (1, 2, 3 ou 4).
            Les deux notes d'encadrement sont jouées sur des contretemps.
            Phrase typique : "note-encadrement-haut (contre-temps) → note-encadrement-bas (contre-temps) → note cible (TEMPS FORT)".
          </p>
        </Box>
      </div>

      {/* ── 5. NOTES D'APPROCHE ── */}
      <Box color="bg-gray-800">
        <h2 className="text-xl font-bold text-white">Notes d'approche chromatiques</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Plus simples que les encadrements : une seule note chromatique précède la note cible, par le bas ou par le haut.
          La <strong className="text-white">double approche</strong> combine une note un demi-ton au-dessus et une autre un demi-ton en-dessous.
        </p>
        <ApproachNotesSVG/>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/40">
            <p className="text-xs font-bold text-white mb-1">Approche par le bas (most common)</p>
            <p className="text-xs text-gray-400">La note cible est précédée d'un demi-ton inférieur.
            Exemple : jouer <strong className="text-gray-200">Bb → B</strong> pour atteindre la tierce de G7.</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/40">
            <p className="text-xs font-bold text-white mb-1">Approche par le haut</p>
            <p className="text-xs text-gray-400">Un demi-ton au-dessus. Crée une résolution descendante.
            Exemple : <strong className="text-gray-200">C# → C</strong> pour atteindre la fondamentale.</p>
          </div>
        </div>
      </Box>

      {/* ── 6. LIGNES II-V-I ── */}
      <Box color="bg-gray-800">
        <h2 className="text-xl font-bold text-white">La ligne bebop sur II–V–I</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Le II–V–I est l'unité de base du bebop. Une ligne bebop typique couvre deux mesures :
          une mesure sur le IIm7, une mesure sur le V7, et résout sur le Maj7.
          Chaque changement d'accord est <em>ciblé</em> par une note d'accord sur le temps 1.
        </p>
        <IIVIBebopSVG/>
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/40 space-y-2">
          <p className="text-xs font-bold text-white">Principes de construction</p>
          <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
            <li>Partir d'une <strong className="text-orange-400">note d'accord</strong> au temps fort (souvent la tierce ou la quinte)</li>
            <li>Croches continues sans pause — le bebop "ne respire jamais"</li>
            <li>Utiliser la gamme bebop dominante sur le V7 pour que les accords tombent en place</li>
            <li>Anticiper le changement d'accord d'un demi-temps (le "kick")</li>
            <li>Résoudre sur la <strong className="text-orange-400">tierce ou septième</strong> du I△7</li>
          </ul>
        </div>
      </Box>

      {/* ── 7. LICK DE PARKER ── */}
      <Box color="bg-gray-800">
        <h2 className="text-xl font-bold text-white">Le "lick" de Parker</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Charlie Parker avait un répertoire de formules mélodiques récurrentes, appelées <em>licks</em> ou <em>formules</em>.
          Il les transposait, les modifiait, les enchaînait dans n'importe quelle tonalité.
          Voici sa ligne descendante caractéristique sur un accord de dominante :
        </p>
        <ParkerLickSVG/>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          <div className="bg-gray-900/50 rounded-xl p-3 border border-orange-800/30">
            <p className="text-xs font-bold text-orange-400 mb-1">Analyse harmonique</p>
            <p className="text-xs text-gray-400">
              La ligne commence sur la fondamentale (G), descend par la ♭7, la 6e, la 5e —
              puis utilise une approche chromatique (F→E) avant de résoudre sur la 5e (D) et la 3e (B).
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-3 border border-blue-800/30">
            <p className="text-xs font-bold text-blue-400 mb-1">Comment l'apprendre</p>
            <p className="text-xs text-gray-400">
              Transposer dans les 12 tonalités. Lent d'abord, puis à vitesse.
              Ensuite, modifier : commencer sur la 3e, sur la 5e, inverser la direction.
              L'objectif est l'<em>internalisation</em>, pas la mémorisation.
            </p>
          </div>
        </div>
      </Box>

      {/* ── 8. LANGUAGE RYTHMIQUE ── */}
      <Box color="bg-gray-800">
        <h2 className="text-xl font-bold text-white">Le langage rythmique bebop</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          La rythmique bebop est aussi importante que la mélodie. La règle de base :
          <strong className="text-white"> jouer des lignes de croches continues</strong>,
          créant une tension que seul le silence (ou la résolution) peut briser.
        </p>
        <RhythmicGridSVG/>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {[
            {
              title: 'La crome continue',
              color: 'border-orange-700/40',
              text: 'Les jazzmen bebop jouent des flux ininterrompus de croches, même à tempo rapide. Pas de triolets, pas de blanches — que des croches. Crée un sentiment d\'urgence et d\'énergie.',
            },
            {
              title: 'L\'anticipation (kick)',
              color: 'border-blue-700/40',
              text: 'Le changement d\'accord est souvent anticipé d\'un demi-temps : on joue la note cible du nouvel accord sur le "et" du 4e temps plutôt que sur le temps 1 suivant.',
            },
            {
              title: 'Le placement des accents',
              color: 'border-green-700/40',
              text: 'Contrairement au swing, les accents bebop tombent souvent sur les temps faibles (2 et 4) et les contretemps. Les "kicks" et les accents déplacés sont une signature du style.',
            },
          ].map(r => (
            <div key={r.title} className={`bg-gray-900/50 rounded-xl p-3 border ${r.color}`}>
              <p className="text-sm font-bold text-white mb-1.5">{r.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </Box>

      {/* ── 9. ORNEMENTS ── */}
      <Box color="bg-gray-800">
        <h2 className="text-xl font-bold text-white">Ornements et articulation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Le mordant (grace note)',
              desc: 'Une note très brève — jouée juste avant la note principale, un demi-ton ou ton en-dessous. "Attaque" la note cible. Caractéristique de Parker et Clifford Brown.',
              exemple: '♪b → ♩ principale',
              color: 'text-orange-400',
            },
            {
              title: 'Le turn (gruppetto)',
              desc: 'Ornement en 4 notes : note principale → note supérieure → note principale → note inférieure → note principale. Peut être chromatique ou diatonique.',
              exemple: 'C → D → C → B → C',
              color: 'text-blue-400',
            },
            {
              title: 'Le glissando (slide)',
              desc: 'Attaque glissée vers une note, typique de la guitare bebop. Wes Montgomery en faisait un usage constant pour connecter deux positions du manche.',
              exemple: '↗ vers note cible',
              color: 'text-green-400',
            },
            {
              title: 'Le shake / bisbigliando',
              desc: 'Oscillation rapide entre deux notes, généralement une tierce. Clifford Brown l\'utilisait sur des notes tenues pour créer de la vibration sans vibrato classique.',
              exemple: '≈ trille de tierce',
              color: 'text-purple-400',
            },
          ].map(o => (
            <div key={o.title} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/40">
              <p className={`text-sm font-bold ${o.color} mb-1`}>{o.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{o.desc}</p>
              <code className="text-[11px] text-gray-500 mt-2 block font-mono">{o.exemple}</code>
            </div>
          ))}
        </div>
      </Box>

      {/* ── 10. HARMONIE BEBOP ── */}
      <Box color="bg-gray-800">
        <h2 className="text-xl font-bold text-white">Harmonies et substitutions bebop</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Le bebop a largement enrichi le vocabulaire harmonique du jazz, notamment en réinterprétant les progressions existantes.
        </p>
        <div className="space-y-3 mt-2">
          {[
            {
              title: 'Substitution tritonique sur le V7',
              before: 'Dm7 → G7 → CMaj7',
              after:  'Dm7 → Db7 → CMaj7',
              note: 'Le Db7 partage les mêmes guide tones (F et B) que G7. La basse fait un mouvement chromatique descendant vers Do.',
              color: 'border-red-800/40 bg-red-900/10',
            },
            {
              title: 'Backdoor dominant (VIIb7)',
              before: 'Dm7 → G7 → CMaj7',
              after:  'Dm7 → Bb7 → CMaj7',
              note: 'Le Bb7 résout sur CMaj7 par mouvement de 2de ascendante. Très "inside" malgré la distance.',
              color: 'border-blue-800/40 bg-blue-900/10',
            },
            {
              title: 'Accord de passage diminué',
              before: 'CMaj7 · · · DMaj7',
              after:  'CMaj7 → C#dim7 → DMaj7',
              note: 'Le dim7 chromatique crée une ligne de basse chromatique entre deux accords distants d\'un ton.',
              color: 'border-purple-800/40 bg-purple-900/10',
            },
            {
              title: 'Turnaround bebop (I–VI–II–V)',
              before: 'CMaj7 · · · CMaj7',
              after:  'CMaj7 → A7 → Dm7 → G7',
              note: 'Le turnaround "classique" rebop. Note : le A7 est une dominante secondaire (V/II), pas Am7.',
              color: 'border-orange-800/40 bg-orange-900/10',
            },
          ].map(h => (
            <div key={h.title} className={`rounded-xl border p-4 ${h.color}`}>
              <p className="text-sm font-bold text-white">{h.title}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="text-xs font-mono text-gray-500 bg-gray-900/60 px-2 py-1 rounded">{h.before}</div>
                <span className="text-gray-600">→</span>
                <div className="text-xs font-mono text-white bg-gray-900/80 px-2 py-1 rounded border border-gray-600">{h.after}</div>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{h.note}</p>
            </div>
          ))}
        </div>
      </Box>

      {/* ── 11. LES MAÎTRES DE LA GUITARE ── */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Bebop à la guitare</h2>
        <p className="text-sm text-gray-400">
          Le bebop a été pensé par des souffleurs. L'adapter à la guitare est un défi technique :
          les lignes de Parker ou Gillespie exigent une vélocité et une fluidité particulières sur le manche.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: 'Charlie Christian',
              years: '1916–1942',
              color: 'border-orange-700/40 bg-orange-900/10',
              accent: 'text-orange-400',
              desc: 'Le père de la guitare électrique jazz. Précurseur du bebop chez les guitaristes, il jouait déjà des lignes chromatiques continues avant même que le bebop soit nommé. Écoutez ses sessions au Minton\'s.',
              listening: ['Solo Flight (Benny Goodman)', 'Waiting for Benny', 'Swing to Bop'],
            },
            {
              name: 'Wes Montgomery',
              years: '1923–1968',
              color: 'border-blue-700/40 bg-blue-900/10',
              accent: 'text-blue-400',
              desc: 'Technique à l\'octet (glissandos, jeu au pouce). Maîtrise absolue de l\'encadrement et des notes d\'approche. Sa façon de "chanter" les lignes bebop avec le pouce est unique.',
              listening: ['Four on Six', 'West Coast Blues', 'Impressions'],
            },
            {
              name: 'Joe Pass',
              years: '1929–1994',
              color: 'border-green-700/40 bg-green-900/10',
              accent: 'text-green-400',
              desc: 'Maître du bebop solo à la guitare. Gammes bebop parfaitement internalisées, encadrements constants, jeu en accords-mélodies sophistiqué. Virtuosité et chant mélodique.',
              listening: ['Virtuoso (album solo)', 'How High the Moon', 'Cherokee'],
            },
            {
              name: 'Grant Green',
              years: '1935–1979',
              color: 'border-purple-700/40 bg-purple-900/10',
              accent: 'text-purple-400',
              desc: 'Style épuré et swinguant, lignes bebop "singles notes" sans artifices. Son phrasé rythmique et sa façon de jouer dans les tempos rapides sont des modèles de clarté.',
              listening: ['Grant\'s First Stand', 'Idle Moments', 'Matador'],
            },
          ].map(m => (
            <div key={m.name} className={`rounded-2xl border p-5 ${m.color}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className={`font-black text-base ${m.accent}`}>{m.name}</p>
                  <p className="text-[11px] text-gray-600 font-mono">{m.years}</p>
                </div>
                <span className="text-xl">🎸</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">{m.desc}</p>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-1.5">À écouter</p>
                <div className="space-y-0.5">
                  {m.listening.map(l => (
                    <p key={l} className="text-[11px] text-gray-500">· {l}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 12. PRATIQUE ── */}
      <Box color="bg-gray-800/60 border border-orange-800/30">
        <h2 className="text-xl font-bold text-white">Plan de travail progressif</h2>
        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Gamme bebop dominante',
              desc: 'Jouer la gamme bebop dominante en croches dans les 12 tonalités, en partant de chaque degré de l\'accord. Lent d\'abord (♩=60), puis monter progressivement.',
              color: 'bg-orange-500',
              duration: '2–3 semaines',
            },
            {
              step: '2',
              title: 'Guide tones',
              desc: 'Improviser uniquement avec les guide tones (3ce et 7e) sur une progression II–V–I. Entendre leur mouvement. Ajouter ensuite une note de passage entre chaque.',
              color: 'bg-blue-500',
              duration: '1–2 semaines',
            },
            {
              step: '3',
              title: 'Encadrements',
              desc: 'Prendre chaque note d\'accord et l\'approcher par un encadrement. Travailler avec un métronome, s\'assurer que la résolution tombe sur le temps fort.',
              color: 'bg-purple-500',
              duration: '2–4 semaines',
            },
            {
              step: '4',
              title: 'Transcription',
              desc: 'Transcrire 2 solos de Charlie Parker (Billie\'s Bounce, Now\'s the Time). Identifier les gammes bebop, les encadrements, les notes d\'approche. Les jouer à la guitare.',
              color: 'bg-green-500',
              duration: 'Continu',
            },
            {
              step: '5',
              title: 'Tempos rapides',
              desc: 'Travailler les lignes bebop à vitesse progressive. À ♩=200+, la précision est impossible sans internalisation. Travailler les positions du manche pour fluidité maximale.',
              color: 'bg-red-500',
              duration: 'Long terme',
            },
          ].map(s => (
            <div key={s.step} className="flex gap-3 items-start">
              <div className={`${s.color} text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                {s.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-white">{s.title}</p>
                  <span className="text-[10px] text-gray-600 font-mono">{s.duration}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Box>

      {/* ── Navigation ── */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link href="/tuto/substitutions-tritoniques"
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl p-4 transition-colors group text-left">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider">Précédent</p>
          <p className="text-sm font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors">← Substitutions tritoniques</p>
        </Link>
        <Link href="/tuto/analyse-standards"
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl p-4 transition-colors group text-right">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider">Suivant</p>
          <p className="text-sm font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors">Analyse de standards →</p>
        </Link>
      </div>

    </main>
  );
}
