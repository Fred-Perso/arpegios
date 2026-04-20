'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { NOTE_NAMES, FretPosition } from '@/lib/music';

const Fretboard = dynamic(() => import('@/components/Fretboard'), { ssr: false });

// ── Music constants ──────────────────────────────────────────────────────────
// Open string semitones from C (mod 12): E A D G B e
const STRING_OPEN = [4, 9, 2, 7, 11, 4];
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
const DEGREE_FILL = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

const CHORD_INTERVALS: Record<string, number[]> = {
  Maj7:    [0, 4, 7, 11],
  m7:      [0, 3, 7, 10],
  Dom7:    [0, 4, 7, 10],
  m7b5:    [0, 3, 6, 10],
  mMaj7:   [0, 3, 7, 11],
  dim7:    [0, 3, 6, 9],
};

const CHORD_DEGREE_LABELS: Record<string, string[]> = {
  Maj7:  ['R', '3', '5', '△7'],
  m7:    ['R', 'b3', '5', 'b7'],
  Dom7:  ['R', '3', '5', 'b7'],
  m7b5:  ['R', 'b3', 'b5', 'b7'],
  mMaj7: ['R', 'b3', '5', '△7'],
  dim7:  ['R', 'b3', 'b5', '°7'],
};

const CHORD_TYPES = [
  { id: 'Maj7',  sym: '△7',  label: 'Major 7',        color: 'text-amber-300', bg: 'bg-amber-900/40 border-amber-700' },
  { id: 'm7',    sym: 'm7',  label: 'Minor 7',         color: 'text-blue-300',  bg: 'bg-blue-900/40 border-blue-700'   },
  { id: 'Dom7',  sym: '7',   label: 'Dominant 7',      color: 'text-red-300',   bg: 'bg-red-900/40 border-red-700'     },
  { id: 'm7b5',  sym: 'ø7',  label: 'Min 7 b5',        color: 'text-purple-300',bg: 'bg-purple-900/40 border-purple-700'},
  { id: 'mMaj7', sym: 'm△7', label: 'Minor Major 7',   color: 'text-teal-300',  bg: 'bg-teal-900/40 border-teal-700'   },
  { id: 'dim7',  sym: '°7',  label: 'Diminished 7',    color: 'text-rose-300',  bg: 'bg-rose-900/40 border-rose-700'   },
];

// ── Voicing data (frets for C root; null = muted) ────────────────────────────
interface Voicing {
  id: string;
  name: string;
  base: (number | null)[];   // 6 strings, index 0 = low E
  rootString: number;        // -1 = rootless
  desc: string;
}

const VOICINGS: Record<string, Voicing[]> = {
  Maj7: [
    { id: 'a',  name: 'Position A',        base: [null, 3, 5, 4, 5, 3],    rootString: 1,  desc: 'Racine sur La — voicing ouvert R-5-7-3' },
    { id: 'e',  name: 'Position E',        base: [8, 10, 9, 9, 8, null],   rootString: 0,  desc: 'Racine sur Mi grave — voicing puissant' },
    { id: 'd2', name: 'Drop 2',            base: [null, null, 10, 9, 8, 7], rootString: 2, desc: 'Voicing fermé R-3-5-7 — 4 cordes' },
    { id: 'rl', name: 'Sans fondamentale', base: [null, null, 2, 4, 3, 5],  rootString: -1, desc: '3-7-9-13 — couleur pianistique' },
  ],
  m7: [
    { id: 'a',  name: 'Position A',        base: [null, 3, 5, 3, 4, 3],    rootString: 1,  desc: 'Racine sur La — R-5-b7-b3' },
    { id: 'e',  name: 'Position E',        base: [8, 10, 10, 8, 11, null], rootString: 0,  desc: 'Racine sur Mi — voicing plein' },
    { id: 'd2', name: 'Drop 2',            base: [null, null, 10, 8, 8, 6], rootString: 2, desc: 'Voicing fermé R-b3-5-b7' },
    { id: 'rl', name: 'Sans fondamentale', base: [null, null, 1, 3, 3, 3],  rootString: -1, desc: 'b3-b7-9-5 — son Cm9 rootless' },
  ],
  Dom7: [
    { id: 'a',  name: 'Position A',        base: [null, 3, 5, 3, 5, null], rootString: 1,  desc: 'Racine sur La — R-5-b7-3' },
    { id: 'e',  name: 'Position E',        base: [8, 10, 8, 9, 8, null],  rootString: 0,  desc: 'Racine sur Mi — voicing tendu' },
    { id: 'd2', name: 'Drop 2',            base: [null, null, 10, 9, 8, 6],rootString: 2,  desc: 'Voicing fermé R-3-5-b7' },
    { id: 'rl', name: 'Sans fondamentale', base: [null, null, 2, 3, 3, 3], rootString: -1, desc: '3-b7-9-5 — son C9 rootless' },
  ],
  m7b5: [
    { id: 'a',  name: 'Position A',  base: [null, 3, 4, 3, 4, null],   rootString: 1,  desc: 'Racine sur La — R-b5-b7-b3' },
    { id: 'e',  name: 'Position E',  base: [8, null, 8, 8, 7, null],   rootString: 0,  desc: 'Racine sur Mi — voicing économique' },
    { id: 'd2', name: 'Drop 2',      base: [null, null, 10, 8, 7, 6],  rootString: 2,  desc: 'Voicing fermé R-b3-b5-b7' },
  ],
  mMaj7: [
    { id: 'a',  name: 'Position A',  base: [null, 3, 5, 4, 4, null],   rootString: 1,  desc: 'Racine sur La — R-5-7-b3 ("James Bond")' },
    { id: 'd2', name: 'Drop 2',      base: [null, null, 10, 8, 8, 7],  rootString: 2,  desc: 'Voicing fermé R-b3-5-△7' },
  ],
  dim7: [
    { id: 'a',  name: 'Position A',  base: [null, 3, 4, 2, 4, null],   rootString: 1,  desc: 'Racine sur La — R-b5-°7-b3' },
    { id: 'd2', name: 'Drop 2',      base: [null, null, 10, 8, 7, 5],  rootString: 2,  desc: 'Voicing fermé R-b3-b5-°7' },
  ],
};

// ── Transpose ─────────────────────────────────────────────────────────────────
function transpose(base: (number | null)[], key: number): (number | null)[] {
  const shifted = base.map(f => f === null ? null : f + key);
  const nonNull = shifted.filter((f): f is number => f !== null);
  if (nonNull.length === 0) return shifted;
  const max = Math.max(...nonNull);
  const adj = max > 14 ? Math.ceil((max - 14) / 12) * 12 : 0;
  return shifted.map(f => f === null ? null : f - adj);
}

function getDegreeIndex(stringIdx: number, fret: number, rootNote: number, chordType: string): 0 | 1 | 2 | 3 {
  const pitch = (STRING_OPEN[stringIdx] + fret) % 12;
  const interval = ((pitch - rootNote) + 12) % 12;
  const ivs = CHORD_INTERVALS[chordType];
  let best = 0, bestDiff = 12;
  ivs.forEach((iv, i) => {
    const diff = Math.min(Math.abs(iv - interval), 12 - Math.abs(iv - interval));
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  });
  return best as 0 | 1 | 2 | 3;
}

function toFretPositions(frets: (number | null)[], rootNote: number, chordType: string): FretPosition[] {
  return frets.flatMap((fret, si) =>
    fret === null ? [] : [{ string: si, fret, degreeIndex: getDegreeIndex(si, fret, rootNote, chordType) }]
  );
}

function getFretRange(frets: (number | null)[]): [number, number] {
  const nonNull = frets.filter((f): f is number => f !== null);
  if (!nonNull.length) return [0, 5];
  const hasOpen = nonNull.includes(0);
  const played = nonNull.filter(f => f > 0);
  const mn = hasOpen ? 0 : Math.max(0, Math.min(...played) - 1);
  const mx = Math.max(mn + 4, Math.max(...nonNull));
  return [mn, mx];
}

function getNoteName(stringIdx: number, fret: number): string {
  return NOTE_NAMES[(STRING_OPEN[stringIdx] + fret) % 12];
}

// ── Chord box diagram ─────────────────────────────────────────────────────────
function ChordBox({ frets, rootNote, chordType, size = 'lg' }:
  { frets: (number|null)[]; rootNote: number; chordType: string; size?: 'sm' | 'lg' }) {

  const nonNull = frets.filter((f): f is number => f !== null);
  const played = nonNull.filter(f => f > 0);
  if (!played.length && !nonNull.includes(0)) return null;

  const hasOpen = nonNull.includes(0);
  const startFret = hasOpen ? 1 : Math.min(...played);
  const endFret = startFret + 3;
  const showNut = startFret === 1;

  const W = size === 'lg' ? 160 : 100;
  const H = size === 'lg' ? 180 : 120;
  const PAD_L = size === 'lg' ? 18 : 12;
  const PAD_R = size === 'lg' ? 18 : 12;
  const PAD_T = size === 'lg' ? 36 : 24;
  const PAD_B = size === 'lg' ? 16 : 10;
  const dotR = size === 'lg' ? 11 : 7;
  const fontSize = size === 'lg' ? 9 : 6;

  const boxW = W - PAD_L - PAD_R;
  const boxH = H - PAD_T - PAD_B;
  const strX = (i: number) => PAD_L + (i / 5) * boxW;
  const fretY = (f: number) => PAD_T + ((f - startFret) / 4) * boxH;
  const midY  = (f: number) => (fretY(f) + fretY(f + 1)) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={size === 'lg' ? 'w-40' : 'w-24'}>
      {/* Nut */}
      {showNut
        ? <rect x={PAD_L - 2} y={PAD_T - 4} width={boxW + 4} height={5} fill="#d4a017" rx={1}/>
        : <text x={W - 4} y={PAD_T + 4} textAnchor="end" fontSize={fontSize + 1} fill="#6b7280">
            {startFret}fr
          </text>
      }

      {/* Fret lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={i} x1={PAD_L} y1={fretY(startFret + i)} x2={W - PAD_R} y2={fretY(startFret + i)}
          stroke="#4b5563" strokeWidth={1.5} />
      ))}

      {/* String lines + X/O */}
      {[0, 1, 2, 3, 4, 5].map(si => {
        const x = strX(si);
        const f = frets[si];
        const muted = f === null;
        const open  = f === 0;
        return (
          <g key={si}>
            <line x1={x} y1={PAD_T} x2={x} y2={H - PAD_B} stroke="#9ca3af" strokeWidth={1 + (5 - si) * 0.3} />
            {muted && (
              <text x={x} y={PAD_T - 8} textAnchor="middle" fontSize={fontSize + 2} fill="#4b5563" fontWeight="bold">×</text>
            )}
            {open && (
              <circle cx={x} cy={PAD_T - 9} r={dotR * 0.6} fill="none" stroke="#9ca3af" strokeWidth={1.5} />
            )}
          </g>
        );
      })}

      {/* Dots */}
      {frets.map((fret, si) => {
        if (fret === null || fret === 0) return null;
        if (fret < startFret || fret > endFret) return null;
        const x = strX(si);
        const y = midY(fret);
        const deg = getDegreeIndex(si, fret, rootNote, chordType);
        const fill = DEGREE_FILL[deg];
        const label = CHORD_DEGREE_LABELS[chordType]?.[deg] ?? '';
        return (
          <g key={si}>
            <circle cx={x} cy={y} r={dotR} fill={fill} stroke="white" strokeWidth={1.5} />
            <text x={x} y={y + fontSize * 0.45} textAnchor="middle" fontSize={fontSize}
              fontWeight="bold" fill="white">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Chord name builder ────────────────────────────────────────────────────────
function buildChordName(rootNote: number, chordType: string): string {
  const root = NOTE_NAMES[rootNote];
  const syms: Record<string, string> = {
    Maj7: '△7', m7: 'm7', Dom7: '7', m7b5: 'ø7', mMaj7: 'm△7', dim7: '°7',
  };
  return root + (syms[chordType] ?? chordType);
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AccordsPage() {
  const [rootNote,  setRootNote]  = useState(0);
  const [chordType, setChordType] = useState('Maj7');
  const [voicingId, setVoicingId] = useState('a');

  const voicings   = VOICINGS[chordType] ?? [];
  const voicing    = voicings.find(v => v.id === voicingId) ?? voicings[0];
  const frets      = voicing ? transpose(voicing.base, rootNote) : [];
  const positions  = toFretPositions(frets, rootNote, chordType);
  const [fretMin, fretMax] = getFretRange(frets);
  const chordName  = buildChordName(rootNote, chordType);
  const ct         = CHORD_TYPES.find(c => c.id === chordType)!;

  const notesList = frets
    .map((f, si) => f !== null ? getNoteName(si, f) : null)
    .filter(Boolean) as string[];
  const uniqueNotes = [...new Set(notesList)];

  return (
    <main className="min-h-screen bg-gray-900 text-white px-3 py-4">
      <div className="max-w-4xl mx-auto space-y-4">

        <div>
          <h1 className="text-xl font-bold text-white">Accords Jazz</h1>
          <p className="text-xs text-gray-500">Voicings guitare — diagrammes et position sur le manche</p>
        </div>

        {/* ── Controls ── */}
        <div className="bg-gray-800 rounded-2xl p-4 space-y-4">

          {/* Root note */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Fondamentale</label>
            <div className="flex items-center gap-1 flex-wrap">
              <button onClick={() => setRootNote(k => (k - 1 + 12) % 12)}
                className="w-8 h-8 rounded-lg bg-gray-700 text-gray-300 font-bold text-lg leading-none shrink-0">‹</button>
              <div className="flex gap-1 flex-wrap flex-1">
                {NOTE_NAMES.map((note, i) => (
                  <button key={i} onClick={() => setRootNote(i)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors
                      ${rootNote === i ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                    {note}
                  </button>
                ))}
              </div>
              <button onClick={() => setRootNote(k => (k + 1) % 12)}
                className="w-8 h-8 rounded-lg bg-gray-700 text-gray-300 font-bold text-lg leading-none shrink-0">›</button>
            </div>
          </div>

          {/* Chord type */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Type d'accord</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {CHORD_TYPES.map(c => (
                <button key={c.id}
                  onClick={() => { setChordType(c.id); setVoicingId('a'); }}
                  className={`flex flex-col items-center py-2 rounded-xl text-xs border transition-all ${
                    chordType === c.id ? c.bg + ' text-white shadow-lg scale-105' : 'bg-gray-700 border-transparent text-gray-400 hover:text-white'
                  }`}>
                  <span className="font-bold text-base">{c.sym}</span>
                  <span className="text-[9px] opacity-70 mt-0.5">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main display ── */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* Chord box + info */}
          <div className={`rounded-2xl border p-5 space-y-4 ${ct.bg}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{chordName}</p>
                <p className={`text-sm font-medium mt-0.5 ${ct.color}`}>{ct.label}</p>
              </div>
              <div className="flex flex-wrap gap-1 text-xs text-right">
                {CHORD_DEGREE_LABELS[chordType].map((label, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: DEGREE_FILL[i] }}/>
                    <span className="text-gray-300">{label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Large chord box */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-end gap-2">
                {/* String name labels */}
                <div className="flex gap-0 mb-1" style={{ paddingLeft: 0 }}>
                  {STRING_NAMES.map((s, i) => (
                    <span key={i} className="text-[9px] text-gray-500 text-center" style={{ width: 27 }}>{s}</span>
                  ))}
                </div>
              </div>
              <ChordBox frets={frets} rootNote={rootNote} chordType={chordType} size="lg" />
              <p className="text-xs text-gray-400 italic text-center">{voicing?.desc}</p>
            </div>

            {/* Notes */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {uniqueNotes.map(n => (
                <span key={n} className="px-2 py-0.5 rounded-md text-xs font-mono font-bold text-white"
                  style={{ backgroundColor: '#374151' }}>{n}</span>
              ))}
            </div>
          </div>

          {/* Voicing selector + neck view */}
          <div className="space-y-3">
            {/* Voicing selector */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Voicings disponibles</p>
              <div className="grid grid-cols-2 gap-2">
                {voicings.map(v => {
                  const vfrets = transpose(v.base, rootNote);
                  return (
                    <button key={v.id}
                      onClick={() => setVoicingId(v.id)}
                      className={`flex flex-col items-center rounded-xl border p-3 gap-2 transition-all ${
                        voicingId === v.id
                          ? `${ct.bg} scale-105 shadow-lg`
                          : 'border-gray-700 bg-gray-700/50 hover:border-gray-500'
                      }`}>
                      <ChordBox frets={vfrets} rootNote={rootNote} chordType={chordType} size="sm" />
                      <span className={`text-xs font-medium ${voicingId === v.id ? 'text-white' : 'text-gray-400'}`}>
                        {v.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fretboard neck view */}
            <div className="bg-gray-800 rounded-2xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Position sur le manche</p>
              <Fretboard
                positions={positions}
                arpeggioType={'Maj7' as any}
                fretMin={fretMin}
                fretMax={fretMax}
                showNotes={false}
                variant="full"
              />
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {CHORD_DEGREE_LABELS[chordType].map((label, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="w-3 h-3 rounded-full" style={{ background: DEGREE_FILL[i] }}/>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Interval reference ── */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Intervalles de l'accord</p>
          <div className="flex gap-2 flex-wrap">
            {CHORD_INTERVALS[chordType].map((iv, i) => {
              const noteLabel = NOTE_NAMES[(rootNote + iv) % 12];
              const INTERVAL_NAMES = ['Fond.', 'Tierce', 'Quinte', 'Septième'];
              const SEMITONE_NAMES: Record<number, string> = {
                0:'R', 3:'b3', 4:'3', 6:'b5', 7:'5', 8:'#5', 9:'°7', 10:'b7', 11:'△7',
              };
              return (
                <div key={i} className="flex-1 min-w-[70px] bg-gray-900 rounded-xl p-3 text-center border"
                  style={{ borderColor: DEGREE_FILL[i] + '60' }}>
                  <p className="text-xs" style={{ color: DEGREE_FILL[i] }}>{INTERVAL_NAMES[i]}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{noteLabel}</p>
                  <p className="text-xs text-gray-500 font-mono">{SEMITONE_NAMES[iv] ?? `+${iv}`}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
