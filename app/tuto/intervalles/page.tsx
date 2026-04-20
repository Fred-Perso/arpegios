'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

// ── Données ───────────────────────────────────────────────────────────────────
const SCALE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const CHORD_POS   = [0, 2, 4, 6]; // positions dans la fenêtre de la gamme

const DEGREES = [
  { deg: 'I',   rootIdx: 0, name: 'C△7', type: 'Majeur 7',   hex: '#f97316', tw: 'bg-orange-600 border-orange-500' },
  { deg: 'II',  rootIdx: 1, name: 'Dm7', type: 'Mineur 7',   hex: '#3b82f6', tw: 'bg-blue-600   border-blue-500'   },
  { deg: 'III', rootIdx: 2, name: 'Em7', type: 'Mineur 7',   hex: '#60a5fa', tw: 'bg-blue-500   border-blue-400'   },
  { deg: 'IV',  rootIdx: 3, name: 'F△7', type: 'Majeur 7',   hex: '#f97316', tw: 'bg-orange-600 border-orange-500' },
  { deg: 'V',   rootIdx: 4, name: 'G7',  type: 'Dominant 7', hex: '#ef4444', tw: 'bg-red-600    border-red-500'    },
  { deg: 'VI',  rootIdx: 5, name: 'Am7', type: 'Mineur 7',   hex: '#3b82f6', tw: 'bg-blue-600   border-blue-500'   },
  { deg: 'VII', rootIdx: 6, name: 'Bø7', type: 'Demi-dim.',  hex: '#a855f7', tw: 'bg-purple-600 border-purple-500' },
];

// Intervalles entre les notes de l'accord (R→3, 3→5, 5→7) pour chaque degré
const ITVL_LABELS = [
  ['Tierce M (4)', 'Quinte J (7)', '7e M (11)'],  // I
  ['Tierce m (3)', 'Quinte J (7)', '7e m (10)'],  // II
  ['Tierce m (3)', 'Quinte J (7)', '7e m (10)'],  // III
  ['Tierce M (4)', 'Quinte J (7)', '7e M (11)'],  // IV
  ['Tierce M (4)', 'Quinte J (7)', '7e m (10)'],  // V
  ['Tierce m (3)', 'Quinte J (7)', '7e m (10)'],  // VI
  ['Tierce m (3)', '5e dim (6)',   '7e m (10)'],   // VII
];

const NOTE_ROLE = ['Fond.', '3e', '5e', '7e'];

// ── Données pour l'animation "pourquoi mineur" ────────────────────────────────
const CHROMA_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const SCALE_SET = new Set([0,2,4,5,7,9,11]); // Do majeur

const WHY_DATA = [
  { deg:'I',   chord:'C△7', rootSt:0,  thirdOffset:4, color:'#f97316', isMaj:true,  isDim:false },
  { deg:'II',  chord:'Dm7', rootSt:2,  thirdOffset:3, color:'#3b82f6', isMaj:false, isDim:false },
  { deg:'III', chord:'Em7', rootSt:4,  thirdOffset:3, color:'#60a5fa', isMaj:false, isDim:false },
  { deg:'IV',  chord:'F△7', rootSt:5,  thirdOffset:4, color:'#f97316', isMaj:true,  isDim:false },
  { deg:'V',   chord:'G7',  rootSt:7,  thirdOffset:4, color:'#ef4444', isMaj:true,  isDim:false },
  { deg:'VI',  chord:'Am7', rootSt:9,  thirdOffset:3, color:'#3b82f6', isMaj:false, isDim:false },
  { deg:'VII', chord:'Bø7', rootSt:11, thirdOffset:3, color:'#a855f7', isMaj:false, isDim:true  },
];

function getWindow(rootIdx: number) {
  return Array.from({ length: 7 }, (_, i) => SCALE_NOTES[(rootIdx + i) % 7]);
}

// ── SVG principal ─────────────────────────────────────────────────────────────
function ScaleSVG({ degIdx, step }: { degIdx: number | null; step: number }) {
  const W = 530; const CY = 95; const R = 22; const GAP = 68;
  const nx = (i: number) => 30 + i * GAP + GAP / 2;

  const notes  = degIdx !== null ? getWindow(DEGREES[degIdx].rootIdx) : SCALE_NOTES;
  const color  = degIdx !== null ? DEGREES[degIdx].hex : '#6b7280';
  const active = degIdx !== null;

  const isChordPos  = (i: number) => CHORD_POS.includes(i);
  const chordStep   = (i: number) => CHORD_POS.indexOf(i);   // 0-3 ou -1
  const isLit       = (i: number) => isChordPos(i) && chordStep(i) <= step;

  // Arcs entre les notes déjà allumées (step 0→1, 1→2, 2→3)
  const arcs = Array.from({ length: Math.min(step, 3) }, (_, s) => {
    const x1 = nx(CHORD_POS[s]);
    const x2 = nx(CHORD_POS[s + 1]);
    return { x1, x2, mx: (x1 + x2) / 2, cy: CY - 52 - s * 12, s };
  });

  return (
    <svg viewBox={`0 0 ${W} 165`} className="w-full" style={{ minWidth: 300 }}>
      {/* ── Arcs de connexion ── */}
      {arcs.map(a => (
        <g key={a.s}>
          <path
            d={`M ${a.x1} ${CY - R - 2} Q ${a.mx} ${a.cy} ${a.x2} ${CY - R - 2}`}
            fill="none" stroke={color} strokeWidth={2} strokeDasharray="5 3" opacity={0.8}
          />
          <text x={a.mx} y={a.cy - 7} textAnchor="middle" fontSize={8} fill={color} fontWeight="bold" opacity={0.9}>
            {ITVL_LABELS[degIdx ?? 0][a.s]}
          </text>
        </g>
      ))}

      {/* ── Cercles notes ── */}
      {notes.map((note, i) => {
        const x    = nx(i);
        const lit  = active && isLit(i);
        const skipped = active && isChordPos(i) && !isLit(i);
        const waiting = active && !isChordPos(i);

        return (
          <g key={i} style={{ transition: 'opacity 0.3s' }}>
            {/* Cercle */}
            <circle cx={x} cy={CY} r={lit ? R + 4 : R}
              fill={lit ? color : '#1f2937'}
              stroke={lit ? color : waiting ? '#374151' : skipped ? '#374151' : '#4b5563'}
              strokeWidth={lit ? 2.5 : 1.5}
              strokeDasharray={waiting ? '3 2' : 'none'}
              opacity={active ? (lit ? 1 : 0.45) : 0.75}
              style={{ transition: 'all 0.35s ease' }}
            />
            {/* Note name */}
            <text x={x} y={CY + 5} textAnchor="middle"
              fontSize={lit ? 13 : 11} fontWeight={lit ? 'bold' : 'normal'}
              fill={lit ? 'white' : '#6b7280'}
              opacity={active ? (lit ? 1 : 0.45) : 0.85}
              style={{ transition: 'all 0.35s ease' }}>
              {note}
            </text>
            {/* Degré dans la fenêtre */}
            <text x={x} y={CY + R + 17} textAnchor="middle" fontSize={8}
              fill={lit ? color : '#4b5563'}
              opacity={active ? 1 : 0.5}>
              {active ? (['R','2','3','4','5','6','7'][i]) : (['1','2','3','4','5','6','7'][i])}
            </text>
            {/* × sur les notes sautées */}
            {active && waiting && step >= 0 && (
              <text x={x} y={CY - R - 6} textAnchor="middle" fontSize={9} fill="#6b7280" opacity={0.6}>×</text>
            )}
            {/* Pastille "en attente" pour les notes d'accord pas encore montrées */}
            {skipped && (
              <circle cx={x} cy={CY - R - 8} r={3} fill={color} opacity={0.3}/>
            )}
          </g>
        );
      })}

      {/* Légende */}
      {!active && (
        <text x={W / 2} y={155} textAnchor="middle" fontSize={10} fill="#6b7280">
          ← Cliquez un degré pour voir la construction →
        </text>
      )}
    </svg>
  );
}

// ── Chord stack ───────────────────────────────────────────────────────────────
function ChordStack({ degIdx, step }: { degIdx: number; step: number }) {
  const window   = getWindow(DEGREES[degIdx].rootIdx);
  const notes    = CHORD_POS.map(p => window[p]);
  const { hex, name, type } = DEGREES[degIdx];

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Pile de notes (affichée de bas en haut = root en bas) */}
      {[...notes].reverse().map((note, ri) => {
        const i = notes.length - 1 - ri; // index réel (0=root, 3=7e)
        const visible = i <= step;
        return (
          <div key={i}
            className="flex items-center gap-3 rounded-lg border px-4 py-1.5 text-sm font-mono"
            style={{
              width: `${100 + i * 22}px`,
              backgroundColor: visible ? hex + '28' : 'transparent',
              borderColor: visible ? hex : '#374151',
              color: visible ? 'white' : '#4b5563',
              opacity: visible ? 1 : 0.3,
              transform: visible ? 'none' : 'translateY(6px)',
              transition: 'all 0.4s ease',
            }}>
            <span className="font-bold text-base w-5">{note}</span>
            <span className="text-xs" style={{ color: visible ? hex : '#4b5563' }}>{NOTE_ROLE[i]}</span>
          </div>
        );
      })}
      {/* Nom de l'accord */}
      <div className="mt-2 text-center" style={{ opacity: step >= 3 ? 1 : 0, transition: 'opacity 0.5s 0.3s' }}>
        <p className="text-xl font-bold" style={{ color: hex }}>{name}</p>
        <p className="text-xs text-gray-400">{type}</p>
      </div>
    </div>
  );
}

// ── Composant animation principal ─────────────────────────────────────────────
function ChordFromScaleAnimator() {
  const [degIdx, setDegIdx] = useState<number | null>(null);
  const [step,   setStep]   = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function selectDegree(i: number) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDegIdx(i);
    setStep(0);
    [1, 2, 3].forEach(s => {
      timers.current.push(setTimeout(() => setStep(s), s * 550));
    });
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div className="space-y-4">
      {/* Boutons degrés */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {DEGREES.map((d, i) => (
          <button key={d.deg}
            onClick={() => selectDegree(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              degIdx === i
                ? d.tw + ' text-white shadow-lg scale-105'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white hover:border-gray-400'
            }`}>
            {d.deg}
            {degIdx === i && <span className="ml-1.5 opacity-70">{d.name}</span>}
          </button>
        ))}
      </div>

      {/* SVG de la gamme */}
      <div className="bg-gray-900 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
              {degIdx !== null
                ? `Gamme vue depuis ${DEGREES[degIdx].name.slice(0,1)} — on saute une note, on prend la suivante`
                : 'Gamme de Do majeur — 7 notes'}
            </p>
            <ScaleSVG degIdx={degIdx} step={step} />
          </div>
          {/* Chord stack */}
          {degIdx !== null && (
            <div className="w-36 shrink-0 pt-8">
              <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-3 text-center">Accord</p>
              <ChordStack degIdx={degIdx} step={step} />
            </div>
          )}
        </div>
      </div>

      {/* Explication étape courante */}
      {degIdx !== null && (
        <div className="bg-gray-900 rounded-xl px-4 py-3 text-sm min-h-[48px]"
          style={{ borderLeft: `3px solid ${DEGREES[degIdx].hex}` }}>
          {step === 0 && (
            <p className="text-gray-300">
              <span className="font-bold" style={{ color: DEGREES[degIdx].hex }}>Fondamentale</span> —
              le degré {DEGREES[degIdx].deg} de la gamme, note{' '}
              <span className="font-mono font-bold text-white">{getWindow(DEGREES[degIdx].rootIdx)[0]}</span>.
              C'est la racine de l'accord.
            </p>
          )}
          {step === 1 && (
            <p className="text-gray-300">
              <span className="font-bold" style={{ color: DEGREES[degIdx].hex }}>Tierce</span> —
              on saute une note, on prend la suivante :{' '}
              <span className="font-mono font-bold text-white">{getWindow(DEGREES[degIdx].rootIdx)[2]}</span>.
              Distance : <span className="text-white font-semibold">{ITVL_LABELS[degIdx][0].split(' ')[0] + ' ' + ITVL_LABELS[degIdx][0].split(' ')[1]}</span>.
            </p>
          )}
          {step === 2 && (
            <p className="text-gray-300">
              <span className="font-bold" style={{ color: DEGREES[degIdx].hex }}>Quinte</span> —
              on saute encore, on prend :{' '}
              <span className="font-mono font-bold text-white">{getWindow(DEGREES[degIdx].rootIdx)[4]}</span>.
              Distance depuis la fondamentale : <span className="text-white font-semibold">7 demi-tons (quinte juste)</span>.
            </p>
          )}
          {step === 3 && (
            <p className="text-gray-300">
              <span className="font-bold" style={{ color: DEGREES[degIdx].hex }}>Septième</span> —
              une dernière tierce :{' '}
              <span className="font-mono font-bold text-white">{getWindow(DEGREES[degIdx].rootIdx)[6]}</span>.
              Accord complet :{' '}
              <span className="font-bold text-lg" style={{ color: DEGREES[degIdx].hex }}>{DEGREES[degIdx].name}</span>
              {' '}<span className="text-gray-400 text-xs">({DEGREES[degIdx].type})</span>
            </p>
          )}
        </div>
      )}

      {/* Rejouer */}
      {degIdx !== null && step >= 3 && (
        <div className="flex justify-center">
          <button
            onClick={() => selectDegree(degIdx)}
            className="px-4 py-1.5 rounded-lg text-xs text-gray-400 border border-gray-700 hover:text-white hover:border-gray-500 transition-colors">
            ↺ Rejouer
          </button>
        </div>
      )}
    </div>
  );
}

// ── Animation "pourquoi majeur/mineur" ───────────────────────────────────────
function ThirdSVG({ idx, countStep }: { idx: number; countStep: number }) {
  const d = WHY_DATA[idx];
  const STEP_W = 72; const CY = 72; const R = 24;
  const nx = (i: number) => 28 + i * STEP_W + STEP_W / 2;
  const W = 5 * STEP_W + 56;

  return (
    <svg viewBox={`0 0 ${W} 158`} className="w-full" style={{ maxWidth: 450 }}>
      {Array.from({ length: 5 }, (_, offset) => {
        const st = (d.rootSt + offset) % 12;
        const note = CHROMA_NOTES[st];
        const inScale = SCALE_SET.has(st);
        const isRoot = offset === 0;
        const isActualThird = offset === d.thirdOffset;
        const isOtherThird = (offset === 3 && d.thirdOffset === 4) || (offset === 4 && d.thirdOffset === 3);
        const isLit = countStep >= offset;
        const isCurrent = countStep === offset;

        let fill = '#1f2937';
        if (isRoot) fill = '#f97316';
        else if (isActualThird && isLit) fill = d.color;
        else if (isLit) fill = '#374151';

        return (
          <g key={offset}>
            {offset > 0 && (
              <line
                x1={nx(offset - 1) + R + 3} y1={CY}
                x2={nx(offset) - R - 3} y2={CY}
                stroke={isLit ? '#6b7280' : '#2d3748'} strokeWidth={2}
                style={{ transition: 'stroke 0.25s' }}
              />
            )}
            <circle cx={nx(offset)} cy={CY} r={R}
              fill={fill}
              stroke={!inScale && !isRoot ? '#4b5563' : '#4b5563'}
              strokeWidth={isRoot || isActualThird ? 2.5 : 1.5}
              strokeDasharray={!inScale && !isRoot ? '4 2' : 'none'}
              opacity={isLit ? 1 : 0.28}
              style={{ transition: 'all 0.35s ease' }}
            />
            <text x={nx(offset)} y={CY + 5} textAnchor="middle" fontSize={12} fontWeight="bold"
              fill={isLit ? 'white' : '#4b5563'}
              opacity={isLit ? 1 : 0.28}
              style={{ transition: 'all 0.35s ease' }}>
              {note}
            </text>
            {isCurrent && offset > 0 && (
              <text x={nx(offset)} y={CY - R - 9} textAnchor="middle" fontSize={15} fontWeight="bold" fill="white">
                +{offset}
              </text>
            )}
            {(isActualThird || isOtherThird) && isLit && (
              <text x={nx(offset)} y={CY + R + 16} textAnchor="middle" fontSize={9} fontWeight="bold"
                fill={inScale ? '#10b981' : '#ef4444'}>
                {inScale ? '✓ dans la gamme' : '✗ hors gamme'}
              </text>
            )}
            {(offset === 3 || offset === 4) && (
              <text x={nx(offset)} y={15} textAnchor="middle" fontSize={8}
                fill={isActualThird ? (d.isMaj ? '#f97316' : '#60a5fa') : '#374151'}
                fontWeight={isActualThird ? 'bold' : 'normal'}>
                {offset === 3 ? 'Tierce m (3)' : 'Tierce M (4)'}
              </text>
            )}
          </g>
        );
      })}
      <text x={W / 2} y={153} textAnchor="middle" fontSize={9} fill="#6b7280">
        {countStep >= 4
          ? `${d.thirdOffset} demi-tons → Tierce ${d.isMaj ? 'majeure' : 'mineure'} → ${d.chord} ${d.isMaj ? '(MAJEUR)' : d.isDim ? '(DIMINUÉ)' : '(mineur)'}`
          : 'Comptage des demi-tons depuis la fondamentale…'}
      </text>
    </svg>
  );
}

function WhyMinorAnimator() {
  const [idx, setIdx]           = useState<number | null>(null);
  const [countStep, setCountStep] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function select(i: number) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setIdx(i);
    setCountStep(0);
    for (let s = 1; s <= 4; s++) {
      timers.current.push(setTimeout(() => setCountStep(s), s * 480));
    }
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const d = idx !== null ? WHY_DATA[idx] : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap justify-center">
        {WHY_DATA.map((dd, i) => (
          <button key={dd.deg}
            onClick={() => select(i)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
            style={idx === i
              ? { backgroundColor: dd.color + '38', borderColor: dd.color, color: 'white', transform: 'scale(1.05)' }
              : { backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#9ca3af' }}>
            {dd.deg} — {dd.chord}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl p-4 min-h-[160px] flex flex-col justify-center">
        {d ? (
          <>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 text-center">
              Sur <span className="font-bold" style={{ color: d.color }}>{CHROMA_NOTES[d.rootSt]}</span> — quelle tierce la gamme impose-t-elle ?
            </p>
            <div className="flex justify-center">
              <ThirdSVG idx={idx!} countStep={countStep} />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            ← Cliquez un degré pour voir pourquoi il est majeur ou mineur
          </p>
        )}
      </div>

      {d && countStep >= 4 && (
        <div className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: d.color + '18', borderLeft: `3px solid ${d.color}` }}>
          {d.isMaj ? (
            <p className="text-gray-300">
              <span className="font-bold text-white">{CHROMA_NOTES[(d.rootSt + 4) % 12]}</span> (tierce majeure, +4) est{' '}
              <span className="text-green-400 font-bold">dans la gamme de Do</span>.
              {' '}→ accord <span style={{ color: d.color }} className="font-bold">MAJEUR</span> ={' '}
              <span className="text-white font-bold">{d.chord}</span>
            </p>
          ) : (
            <p className="text-gray-300">
              <span className="font-bold text-white">{CHROMA_NOTES[(d.rootSt + 4) % 12]}</span> (tierce majeure, +4) est{' '}
              <span className="text-red-400 font-bold">hors de la gamme de Do</span>.
              {' '}La gamme force{' '}
              <span className="font-bold text-white">{CHROMA_NOTES[(d.rootSt + 3) % 12]}</span> (tierce mineure, +3) →
              accord <span style={{ color: d.color }} className="font-bold">{d.isDim ? 'DIMINUÉ' : 'mineur'}</span> ={' '}
              <span className="text-white font-bold">{d.chord}</span>
            </p>
          )}
        </div>
      )}

      {d && countStep >= 4 && (
        <div className="flex justify-center">
          <button onClick={() => select(idx!)}
            className="px-4 py-1.5 rounded-lg text-xs text-gray-400 border border-gray-700 hover:text-white hover:border-gray-500 transition-colors">
            ↺ Rejouer
          </button>
        </div>
      )}
    </div>
  );
}

// ── Schemas existants ─────────────────────────────────────────────────────────
function IntervalSchema() {
  const W = 680; const H = 160;
  const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B','C'];
  const inScale = [true,false,true,false,true,true,false,true,false,true,false,true,true];
  const cellW = W / 12; const y = 60; const r = 16;
  const colors = ['#f97316','#6b7280','#3b82f6','#6b7280','#22c55e','#a855f7','#6b7280','#f97316','#6b7280','#3b82f6','#6b7280','#22c55e','#f97316'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" style={{minWidth:320}}>
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
      {[
        {from:0,to:2,label:'1T',color:'#60a5fa'},{from:2,to:4,label:'1T',color:'#60a5fa'},
        {from:4,to:5,label:'½T',color:'#f87171'},{from:5,to:7,label:'1T',color:'#60a5fa'},
        {from:7,to:9,label:'1T',color:'#60a5fa'},{from:9,to:11,label:'1T',color:'#60a5fa'},
        {from:11,to:12,label:'½T',color:'#f87171'},
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
      {[0,2,4,5,7,9,11,12].map((pos,i)=>(
        <text key={i} x={pos*cellW+cellW/2} y={y+36} textAnchor="middle" fontSize={9} fill="#9ca3af">
          {['1','2','3','4','5','6','7','8'][i]}
        </text>
      ))}
      <text x={W/2} y={H-4} textAnchor="middle" fontSize={9} fill="#6b7280">Gamme de Do majeur — les 12 demi-tons chromatiques</text>
    </svg>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
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
            La gamme majeure est construite avec un enchaînement précis de <strong className="text-white">tons</strong> (1T = 2 cases) et <strong className="text-white">demi-tons</strong> (½T = 1 case).
            La formule est <strong className="text-white">1T 1T ½T 1T 1T 1T ½T</strong>.
          </p>
          <IntervalSchema />
          <p className="text-gray-400 text-xs text-center mt-2">
            Les notes de la gamme sont en couleur — les # (notes noires) ne font pas partie de Do majeur.
          </p>
        </Box>

        {/* ── Animation ── */}
        <Box color="bg-gray-800 border border-orange-800/50">
          <h2 className="text-xl font-bold">3. Animation — Comment un accord est extrait de la gamme</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Cliquez sur un degré. Regardez comment les 4 notes de l'accord sont sélectionnées
            dans la gamme en <strong className="text-white">sautant une note sur deux</strong>.
          </p>
          <ChordFromScaleAnimator />
          <div className="bg-gray-900 rounded-xl p-4 text-sm mt-2">
            <p className="text-white font-semibold mb-2">La règle universelle</p>
            <p className="text-gray-300 leading-relaxed">
              Quel que soit le degré choisi, la méthode est identique :{' '}
              <strong className="text-white">prendre une note, sauter la suivante, prendre, sauter, prendre, sauter, prendre.</strong>{' '}
              Ce sont toujours les notes de la gamme — jamais de notes extérieures.
              C'est pourquoi les accords diffèrent : les distances entre les notes de la gamme ne sont pas égales
              (il y a des tons et des demi-tons), donc les intervalles changent selon le point de départ.
            </p>
          </div>
        </Box>

        <Box>
          <h2 className="text-xl font-bold">4. Construction des accords à 4 sons</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            Un accord à 4 sons (accord de septième) se construit en empilant 3 tierces.
            Selon le type de tierce (majeure = 4 demi-tons, mineure = 3), on obtient un accord différent.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 space-y-2 font-mono text-sm">
            {[
              { deg:'I',   chord:'C△7', notes:'C – E – G – B',   color:'text-amber-300'},
              { deg:'II',  chord:'Dm7', notes:'D – F – A – C',   color:'text-blue-300'},
              { deg:'III', chord:'Em7', notes:'E – G – B – D',   color:'text-blue-300'},
              { deg:'IV',  chord:'F△7', notes:'F – A – C – E',   color:'text-amber-300'},
              { deg:'V',   chord:'G7',  notes:'G – B – D – F',   color:'text-red-300'},
              { deg:'VI',  chord:'Am7', notes:'A – C – E – G',   color:'text-blue-300'},
              { deg:'VII', chord:'Bø7', notes:'B – D – F – A',   color:'text-purple-300'},
            ].map(r=>(
              <div key={r.deg} className="flex items-center gap-3">
                <span className="text-gray-500 w-8">{r.deg}</span>
                <span className={`font-bold w-16 ${r.color}`}>{r.chord}</span>
                <span className="text-gray-400 text-xs">{r.notes}</span>
              </div>
            ))}
          </div>
        </Box>

        <Box color="bg-indigo-900/20 border border-indigo-800/60">
          <h2 className="text-xl font-bold text-indigo-200">⚡ Pourquoi des accords mineurs dans une tonalité majeure ?</h2>
          <p className="text-gray-300 leading-relaxed">
            C'est <strong className="text-white">la</strong> question que tout le monde se pose.
            La réponse tient en un principe :{' '}
            <strong className="text-indigo-300">ce n'est pas la tonalité qui décide si un accord est majeur ou mineur —
            c'est la distance en demi-tons entre la fondamentale et sa tierce.</strong>
          </p>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-2">
            <p className="text-white font-semibold">Le mécanisme :</p>
            <div className="flex flex-col sm:flex-row gap-3 text-xs">
              <div className="flex-1 bg-amber-900/30 border border-amber-800/50 rounded-lg p-3">
                <p className="font-bold text-amber-300 mb-1">Tierce majeure = 4 demi-tons</p>
                <p className="text-gray-400">La note candidate est dans la gamme → accord MAJEUR</p>
              </div>
              <div className="flex-1 bg-blue-900/30 border border-blue-800/50 rounded-lg p-3">
                <p className="font-bold text-blue-300 mb-1">Tierce mineure = 3 demi-tons</p>
                <p className="text-gray-400">La tierce majeure n'est pas dans la gamme → accord mineur</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Cliquez un degré — l'animation compte les demi-tons depuis la fondamentale et montre
            quelle tierce la gamme impose.
          </p>
          <WhyMinorAnimator />
          <div className="bg-gray-900 rounded-xl p-4 text-sm">
            <p className="text-white font-semibold mb-2">Récapitulatif — gamme de Do majeur :</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {[
                { deg:'I – C',   third:'C→E = 4', type:'MAJEUR', color:'text-amber-300' },
                { deg:'II – D',  third:'D→F = 3', type:'mineur', color:'text-blue-300'  },
                { deg:'III – E', third:'E→G = 3', type:'mineur', color:'text-blue-300'  },
                { deg:'IV – F',  third:'F→A = 4', type:'MAJEUR', color:'text-amber-300' },
                { deg:'V – G',   third:'G→B = 4', type:'MAJEUR', color:'text-red-300'   },
                { deg:'VI – A',  third:'A→C = 3', type:'mineur', color:'text-blue-300'  },
                { deg:'VII – B', third:'B→D = 3', type:'dim.',   color:'text-purple-300'},
              ].map(r => (
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
          <h2 className="text-xl font-bold">5. Les 4 types d'accords et leurs intervalles</h2>
          <div className="space-y-3 text-sm">
            {[
              { sym:'△7',   name:'Major 7',       formula:'1 – 3 – 5 – △7',    semitones:'0 – 4 – 7 – 11', desc:'Tierce M + Quinte J + 7e M. Son lumineux, stable.',      color:'text-amber-300'},
              { sym:'m7',   name:'Minor 7',        formula:'1 – b3 – 5 – b7',   semitones:'0 – 3 – 7 – 10', desc:'Tierce m + Quinte J + 7e m. Son doux, mélancolique.',    color:'text-blue-300'},
              { sym:'7',    name:'Dominant 7',     formula:'1 – 3 – 5 – b7',    semitones:'0 – 4 – 7 – 10', desc:'Tierce M + Quinte J + 7e m. Tension, résout sur le I.',  color:'text-red-300'},
              { sym:'ø7',   name:'Minor 7 b5',     formula:'1 – b3 – b5 – b7',  semitones:'0 – 3 – 6 – 10', desc:'Tierce m + 5te dim + 7e m. Semi-diminué, couleur sombre.',color:'text-purple-300'},
              { sym:'m△7',  name:'Minor/Major 7',  formula:'1 – b3 – 5 – △7',   semitones:'0 – 3 – 7 – 11', desc:'Tierce m + 5te J + 7e M. Couleur "James Bond".',         color:'text-teal-300'},
              { sym:'o7',   name:'Diminished 7',   formula:'1 – b3 – b5 – bb7', semitones:'0 – 3 – 6 – 9',  desc:'4 tierces mineures égales. Accord symétrique, instable.', color:'text-rose-300'},
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
