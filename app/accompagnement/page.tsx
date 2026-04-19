'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  subscribeGrids,
  saveGrid  as saveGridToDb,
  deleteGrid as deleteGridToDb,
  type GridDoc, type StoredChord,
} from '@/lib/grids';

// ─── Types ───────────────────────────────────────────────────────────────────
type Chord = { name: string; notes: string[]; beats: number; type: string; rootIdx: number };

// ─── Piano (Salamander Grand) ────────────────────────────────────────────────
const BASE_URL = 'https://tonejs.github.io/audio/salamander/';
const SAMPLE_MAP: Record<string, string> = {
  A0:'A0.mp3', C1:'C1.mp3', 'D#1':'Ds1.mp3', 'F#1':'Fs1.mp3',
  A1:'A1.mp3', C2:'C2.mp3', 'D#2':'Ds2.mp3', 'F#2':'Fs2.mp3',
  A2:'A2.mp3', C3:'C3.mp3', 'D#3':'Ds3.mp3', 'F#3':'Fs3.mp3',
  A3:'A3.mp3', C4:'C4.mp3', 'D#4':'Ds4.mp3', 'F#4':'Fs4.mp3',
  A4:'A4.mp3', C5:'C5.mp3', 'D#5':'Ds5.mp3', 'F#5':'Fs5.mp3',
  A5:'A5.mp3', C6:'C6.mp3', 'D#6':'Ds6.mp3', 'F#6':'Fs6.mp3',
  A6:'A6.mp3', C7:'C7.mp3', 'D#7':'Ds7.mp3', 'F#7':'Fs7.mp3',
  A7:'A7.mp3', C8:'C8.mp3',
};

// ─── Contrebasse (FluidR3 GM acoustic bass) ───────────────────────────────────
const BASS_URL = 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_bass-mp3/';

const BASS_MAP: Record<string, string> = {
  'E1':'E1.mp3', 'G1':'G1.mp3',
  'E2':'E2.mp3', 'G2':'G2.mp3',
  'E3':'E3.mp3', 'G3':'G3.mp3',
};

// ─── Music helpers ───────────────────────────────────────────────────────────
const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const;
const TYPES = ['Maj7','m7','Dom7','m7b5','mMaj7','dim7'] as const;
const TYPE_SYM: Record<string, string> = {
  Maj7:'△7', m7:'m7', Dom7:'7', m7b5:'ø7', mMaj7:'m△7', dim7:'°7',
};
const IV: Record<string, number[]> = {
  Maj7:[0,4,7,11], m7:[0,3,7,10], Dom7:[0,4,7,10],
  m7b5:[0,3,6,10], mMaj7:[0,3,7,11], dim7:[0,3,6,9],
};

function buildChord(rootIdx: number, type: string, beats = 4): Chord {
  // roots C,C# → octave 4; D…B → octave 3  (keeps voicings in comfortable range)
  const rootMidi = rootIdx < 2 ? 60 + rootIdx : 48 + rootIdx;
  const notes = (IV[type] ?? [0,4,7,11]).map(d => {
    const m = rootMidi + d;
    return `${NOTES[m % 12]}${Math.floor(m / 12) - 1}`;
  });
  return { name:`${NOTES[rootIdx]}${TYPE_SYM[type]}`, notes, beats, type, rootIdx };
}

// ─── Drum pattern — 8 croches swinguées (swing 0.55) ─────────────────────────
// R=ride fort  r=ride léger  H=hihat  k=kick  s=snare léger  S=snare fort  .=silence
const DRUM_SWING = 0.55;
const DRUM_PAT = {
  ride:  ['R', '.', '.', '.', 'R', '.', '.', '.'],
  hihat: ['.', '.', '.', '.', '.', '.', '.', '.'],
  snare: ['S', '.', 'S', '.', 'S', '.', 'S', '.'],
} as const;
const DRUM_VEL: Record<string, number> = {
  R: 0.95, r: 0.55, H: 0.88, s: 0.44, S: 0.86,
};

// ─── Initial chart: Fly Me to the Moon (Bart Howard) — 32 mesures ────────────
// Forme Intro–A–B–C  (4 × 8 mesures)
const INITIAL: Chord[][] = [
  // ── Intro (mes 1–8) — exposition du thème ────────────────────────
  [buildChord(9,  'm7')],                                       // 1  Am7
  [buildChord(2,  'm7')],                                       // 2  Dm7
  [buildChord(7,  'Dom7')],                                     // 3  G7
  [buildChord(0,  'Maj7')],                                     // 4  Cmaj7
  [buildChord(5,  'Maj7')],                                     // 5  Fmaj7
  [buildChord(11, 'm7b5')],                                     // 6  Bm7b5
  [buildChord(4,  'Dom7')],                                     // 7  E7
  [buildChord(9,  'm7',2),  buildChord(9,  'Dom7',2)],          // 8  Am7 | A7

  // ── A (mes 9–16) — développement en Do majeur ────────────────────
  [buildChord(2,  'm7')],                                       // 9  Dm7
  [buildChord(7,  'Dom7')],                                     // 10 G7
  [buildChord(0,  'Maj7')],                                     // 11 Cmaj7
  [buildChord(9,  'm7')],                                       // 12 Am7
  [buildChord(2,  'm7')],                                       // 13 Dm7
  [buildChord(7,  'Dom7')],                                     // 14 G7
  [buildChord(0,  'Maj7')],                                     // 15 Cmaj7
  [buildChord(0,  'Maj7')],                                     // 16 Cmaj7

  // ── B (mes 17–24) — retour thème principal ───────────────────────
  [buildChord(9,  'm7')],                                       // 17 Am7
  [buildChord(2,  'm7')],                                       // 18 Dm7
  [buildChord(7,  'Dom7')],                                     // 19 G7
  [buildChord(0,  'Maj7')],                                     // 20 Cmaj7
  [buildChord(5,  'Maj7')],                                     // 21 Fmaj7
  [buildChord(11, 'm7b5')],                                     // 22 Bm7b5
  [buildChord(4,  'Dom7')],                                     // 23 E7
  [buildChord(9,  'm7',2),  buildChord(9,  'Dom7',2)],          // 24 Am7 | A7

  // ── C (mes 25–32) — coda : II–V chaînés, retour turnaround ───────
  [buildChord(2,  'm7')],                                       // 25 Dm7
  [buildChord(7,  'Dom7')],                                     // 26 G7
  [buildChord(4,  'm7')],                                       // 27 Em7
  [buildChord(9,  'Dom7')],                                     // 28 A7
  [buildChord(2,  'm7')],                                       // 29 Dm7
  [buildChord(7,  'Dom7')],                                     // 30 G7
  [buildChord(0,  'Maj7')],                                     // 31 Cmaj7
  [buildChord(11, 'm7b5',2), buildChord(4, 'Dom7',2)],          // 32 Bm7b5 | E7 → retour Intro
];

// ─── Colors ──────────────────────────────────────────────────────────────────
const COL_ACTIVE: Record<string, string> = {
  Maj7:'bg-amber-800/80 border-amber-400 text-amber-200',
  m7:  'bg-blue-800/80  border-blue-400  text-blue-200',
  Dom7:'bg-red-800/80   border-red-400   text-red-200',
  m7b5:'bg-purple-800/80 border-purple-400 text-purple-200',
  mMaj7:'bg-teal-800/80 border-teal-400  text-teal-200',
  dim7:'bg-rose-800/80  border-rose-400  text-rose-200',
};
const COL_IDLE: Record<string, string> = {
  Maj7:'border-amber-900 text-amber-500', m7:'border-blue-900 text-blue-500',
  Dom7:'border-red-900 text-red-500',     m7b5:'border-purple-900 text-purple-500',
  mMaj7:'border-teal-900 text-teal-500',  dim7:'border-rose-900 text-rose-500',
};
const COL_BTN: Record<string, string> = {
  Maj7:'bg-amber-700 text-white', m7:'bg-blue-700 text-white',
  Dom7:'bg-red-700 text-white',   m7b5:'bg-purple-700 text-white',
  mMaj7:'bg-teal-700 text-white', dim7:'bg-rose-700 text-white',
};

// ─── Import parser ───────────────────────────────────────────────────────────
/*
  FORMAT LEAD SHEET TEXTE
  ────────────────────────
  # Titre (ligne optionnelle)
  | Am7 | Dm7 | G7 | Cmaj7 |
  | Fmaj7 | Bm7b5 E7 | Am7 | E7 |

  Règles :
  • Lignes commençant par # → titre
  • Barres verticales | séparent les mesures
  • Plusieurs accords dans une mesure = séparés par espace (2 accords = 2 temps chacun)
  • Fondamentales : C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B
  • Suffixes acceptés :
      maj7 △7 M7          → Maj7
      m7  min7            → m7
      7   dom7            → Dom7 (dominant)
      m7b5  ø  ø7         → m7b5
      mMaj7  m△7  mM7     → mMaj7
      dim7  °7  o7  dim   → dim7
*/

const FLAT_ROOTS: Record<string, string> = {
  Bb:'A#', Eb:'D#', Ab:'G#', Db:'C#', Gb:'F#',
};

function parseChordType(suffix: string): string | null {
  const s = suffix.replace(/\s/g, '');
  // mMaj7 must be checked before m7 and Maj7
  if (/^(mmaj7?|m[△Δ]7?|minmaj7?|mm7?)$/i.test(s)) return 'mMaj7';
  // m7b5 before m7
  if (/^(m7b5|m-5|min7b5|[øo]7?|half-?dim7?)$/i.test(s)) return 'm7b5';
  // dim7
  if (/^(dim7?|[°o]7?)$/i.test(s)) return 'dim7';
  // Maj7 (△ is U+25B3, Δ is U+0394)
  if (/^(maj7?|[△Δ]7?|M7?)$/.test(s) || s === '') return 'Maj7';
  // m7 before bare "7"
  if (/^(m7?|min7?)$/i.test(s)) return 'm7';
  // Dom7
  if (/^(7|dom7?|dominant7?)$/i.test(s)) return 'Dom7';
  return null;
}

function parseChordName(token: string): StoredChord | null {
  token = token.trim();
  if (!token) return null;

  let root: string;
  let rest: string;

  // 2-char flat root (Bb, Eb…)
  const twoChar = token.slice(0, 2);
  if (FLAT_ROOTS[twoChar]) {
    root = FLAT_ROOTS[twoChar]; rest = token.slice(2);
  } else if (token.length >= 2 && token[1] === '#') {
    root = token.slice(0, 2); rest = token.slice(2);
  } else if (/^[A-G]/.test(token)) {
    root = token[0]; rest = token.slice(1);
  } else return null;

  const rootIdx = (NOTES as readonly string[]).indexOf(root);
  if (rootIdx === -1) return null;

  const type = parseChordType(rest);
  if (!type) return null;

  return { rootIdx, type, beats: 4 };
}

export function importFromText(text: string): { title: string; bars: Chord[][] } | null {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) return null;

  let title = 'Grille importée';
  const parsedBars: Chord[][] = [];

  for (const line of lines) {
    if (line.startsWith('#')) { title = line.slice(1).trim(); continue; }

    // Split on | and process each segment as a bar
    const segments = line.split('|').map(s => s.trim()).filter(Boolean);
    for (const seg of segments) {
      const tokens = seg.split(/\s+/).filter(Boolean);
      if (!tokens.length) continue;

      // Max 2 chords per bar
      const chordTokens = tokens.slice(0, 2);
      const beats = chordTokens.length === 1 ? 4 : 2;
      const bar: Chord[] = [];

      for (const tok of chordTokens) {
        const sc = parseChordName(tok);
        if (sc) bar.push(buildChord(sc.rootIdx, sc.type, beats));
      }
      if (bar.length) parsedBars.push(bar);
    }
  }

  return parsedBars.length ? { title, bars: parsedBars } : null;
}

// ─── Event builder ───────────────────────────────────────────────────────────
type EvItem = { chord: Chord; barIdx: number; flatIdx: number; beatStart: number };
function buildEvents(bars: Chord[][]): { events: EvItem[]; totalBeats: number } {
  const events: EvItem[] = [];
  let beat = 0; let flat = 0;
  bars.forEach((bar, b) => bar.forEach(chord => {
    events.push({ chord, barIdx: b, flatIdx: flat++, beatStart: beat });
    beat += chord.beats;
  }));
  return { events, totalBeats: beat };
}
function bt(beat: number) { return `${Math.floor(beat / 4)}:${beat % 4}:0`; }
function midiToNote(midi: number): string {
  return `${NOTES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

// ─── Walking bass ─────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWalkingBass(Tone: any, events: EvItem[], totalBeats: number, instrument: any): { bassPart: any } {
  const bassNotes: { time: string; note: string }[] = [];
  // Approach direction cycles by barIdx: ½-below, ½-above, whole-below, whole-above
  const APPROACH = [-1, 1, -2, 2];

  events.forEach((ev, i) => {
    const { rootIdx, type, beats } = ev.chord;
    const intervals = IV[type] ?? [0, 4, 7, 10];
    const bassRoot = 36 + rootIdx; // C2 = 36
    const chordTones = intervals.map(d => bassRoot + d);
    const nextRoot = 36 + events[(i + 1) % events.length].chord.rootIdx;

    for (let b = 0; b < beats; b++) {
      let midi: number;

      if (b === 0) {
        // Beat 1: root — occasional low octave displacement for variety
        midi = bassRoot;
        if ((i * 7 + ev.barIdx * 3) % 5 === 0) midi -= 12;
      } else if (b === beats - 1 && beats > 1) {
        // Last beat: approach to next chord root (direction varies by barIdx)
        midi = nextRoot + APPROACH[ev.barIdx % 4];
      } else {
        // Inner beats: 8-way hash picks from chord tones + chromatic passing notes
        const h = (i * 7 + b * 3 + ev.barIdx * 5) % 8;
        const inner = [
          chordTones[1],       // 3rd
          chordTones[2],       // 5th
          chordTones[3],       // 7th
          chordTones[2],       // 5th (doubled — most common walking choice)
          bassRoot - 1,        // chromatic ½-step below root
          bassRoot + 2,        // whole-step above root (leading)
          chordTones[1] - 1,   // chromatic below 3rd
          chordTones[3] - 1,   // chromatic below 7th
        ];
        midi = inner[h];
      }

      while (midi > 47) midi -= 12;
      while (midi < 28) midi += 12;
      bassNotes.push({ time: bt(ev.beatStart + b), note: midiToNote(midi) });
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bassPart = new (Tone.Part as any)(
    (time: number, val: { note: string }) => {
      instrument?.triggerAttackRelease(val.note, '4n', time + 0.010, 0.88);
    },
    bassNotes,
  );
  bassPart.loop = true;
  bassPart.loopEnd = bt(totalBeats);
  bassPart.start(0);
  return { bassPart };
}

// ─── Jazz comp patterns (8 bars, then repeats) ───────────────────────────────
// n = [root, 3rd, 5th, 7th]  |  beatOffset = position within the chord (0–3)
type CompHit = { beatOffset: number; notes: string[]; dur: string; vel: number };

function getCompHits(barIdx: number, n: string[]): CompHit[] {
  switch (barIdx % 8) {
    case 0: return [ // shell on beat 2 only
      { beatOffset: 1, notes: [n[1], n[3]],       dur: '4n', vel: 0.63 },
    ];
    case 1: return [ // classic 2 + 4 (standard swing comp)
      { beatOffset: 1, notes: [n[1], n[3]],       dur: '4n', vel: 0.65 },
      { beatOffset: 3, notes: [n[1], n[2], n[3]], dur: '8n', vel: 0.50 },
    ];
    case 2: return [ // light beat 1 + shell beat 3
      { beatOffset: 0, notes: [n[0], n[2]],       dur: '4n', vel: 0.42 },
      { beatOffset: 2, notes: [n[1], n[3]],       dur: '4n', vel: 0.60 },
    ];
    case 3: return [ // single hit beat 3 — maximum air
      { beatOffset: 2, notes: [n[1], n[2], n[3]], dur: '4n', vel: 0.58 },
    ];
    case 4: return [ // beats 1 + 3 — strong statement
      { beatOffset: 0, notes: [n[1], n[3]],       dur: '4n', vel: 0.55 },
      { beatOffset: 2, notes: [n[1], n[2], n[3]], dur: '4n', vel: 0.62 },
    ];
    case 5: return [ // anticipation — beat 4 only
      { beatOffset: 3, notes: [n[0], n[1], n[3]], dur: '8n', vel: 0.52 },
    ];
    case 6: return [ // consecutive beats 2 + 3
      { beatOffset: 1, notes: [n[1], n[3]],       dur: '8n', vel: 0.60 },
      { beatOffset: 2, notes: [n[0], n[2], n[3]], dur: '4n', vel: 0.55 },
    ];
    case 7: return []; // complete silence — breathing room
    default: return [];
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AccompagnementPage() {
  const [title,        setTitle]        = useState('Fly Me to the Moon');
  const [status,       setStatus]       = useState<'idle'|'loading'|'counting'|'playing'>('idle');
  const [countBeat,    setCountBeat]    = useState<number | null>(null);
  const [bpm,          setBpm]          = useState(120);
  const [currentFlat,  setCurrentFlat]  = useState<number | null>(null);
  const [drumOn,       setDrumOn]       = useState(true);
  const [pianoVol,     setPianoVol]     = useState(80);
  const [bassVol,      setBassVol]      = useState(78);
  const [drumVol,      setDrumVol]      = useState(65);
  const [bars,         setBars]         = useState<Chord[][]>(INITIAL);
  const [editCell,     setEditCell]     = useState<{ barIdx: number; chordIdx: number } | null>(null);
  const [editRoot,     setEditRoot]     = useState(9);
  const [editType,     setEditType]     = useState('m7');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user,         setUser]         = useState<any>(null);
  const [savedGrids,   setSavedGrids]   = useState<GridDoc[]>([]);
  const [saveName,     setSaveName]     = useState('');
  const [showSaveInput,setShowSaveInput]= useState(false);
  const [showImport,   setShowImport]   = useState(false);
  const [importText,   setImportText]   = useState('');
  const [importPreview,setImportPreview]= useState<{ title: string; bars: Chord[][] } | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [saveError,    setSaveError]    = useState<string | null>(null);
  const [saveKey,      setSaveKey]      = useState('');
  const [saveTips,     setSaveTips]     = useState('');
  const [gridKey,      setGridKey]      = useState('La mineur / Do majeur');
  const [gridTips,     setGridTips]     = useState(
    'INTRO & B (mes 1–8, 17–24) : cycle ↓5 diatonique Am7→Dm7→G7→Cmaj7→Fmaj7, ' +
    'puis IIø–V–I en La min (Bm7b5–E7–Am7). Mes 8/24 : Am7|A7 = pivot vers Ré min (V7/IVm). ' +
    'A (mes 9–16) : II–V–I répété en Do maj (Dm7–G7–Cmaj7), Am7 = retour relatif mineur, ' +
    'double Cmaj7 final = plateau de stabilité. ' +
    'C (mes 25–32) : II–V chaînés — Dm7–G7 (→Do), Em7–A7 (→Ré, dominante secondaire), ' +
    'Dm7–G7–Cmaj7, turnaround Bm7b5–E7 → retour Intro. ' +
    'Impro : penta La min sur toute la grille · dorien/Dm7 · mixolydien/G7 · lydien/Fmaj7 · locrien/Bm7b5.'
  );
  const [transposeOffset, setTransposeOffset] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const samplerRef     = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bassSamplerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const partRef        = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drumKitRef     = useRef<any>(null);
  const loadedRef      = useRef(false);
  const playIdRef      = useRef(0);

  // Load localStorage grids on mount (fallback when Firebase unavailable)
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('arpegios-grids') ?? '[]');
    if (local.length) setSavedGrids(local);
  }, []);

  // Firebase anonymous auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      try {
        if (!u) { const { user: anon } = await signInAnonymously(auth); setUser(anon); }
        else setUser(u);
      } catch (e) { console.warn('Firebase auth failed:', e); }
    });
    return unsub;
  }, []);

  // Firestore grids subscription — wait for auth before subscribing
  useEffect(() => {
    if (!user) return;
    return subscribeGrids(setSavedGrids);
  }, [user]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      partRef.current?.dispose();
      samplerRef.current?.dispose();
      bassSamplerRef.current?.dispose();
      disposeDrums();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Drum kit ────────────────────────────────────────────────────────────────
  function disposeDrums() {
    const k = drumKitRef.current;
    if (!k) return;
    try { k.drumPart?.stop(0); k.drumPart?.dispose(); } catch {}
    try { k.bassPart?.stop(0); k.bassPart?.dispose(); } catch {}
    ['ride','rideRev','hihat','snareBody','snareWire','snareWireFilter','warmth','comp','bus'].forEach(x => {
      try { k[x]?.dispose(); } catch {}
    });
    drumKitRef.current = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildDrums(Tone: any, vol: number, enabled: boolean) {
    disposeDrums();
    const bus    = new Tone.Gain(enabled ? vol / 100 : 0).toDestination();
    const warmth = new Tone.Distortion({ distortion: 0.03, wet: 0.10 }).connect(bus);
    const comp   = new Tone.Compressor({ threshold: -18, ratio: 4, attack: 0.003, release: 0.12 }).connect(warmth);

    const rideRev = new Tone.Freeverb({ roomSize: 0.75, dampening: 3500, wet: 0.30 }).connect(comp);
    const ride = new Tone.MetalSynth({
      frequency: 500, harmonicity: 5.1, modulationIndex: 64,
      envelope: { attack: 0.001, decay: 1.5, release: 3.0 }, resonance: 5500, octaves: 2.2,
    }).connect(rideRev);
    ride.volume.value = 5;

    const hihat = new Tone.MetalSynth({
      frequency: 1100, harmonicity: 5.1, modulationIndex: 16,
      envelope: { attack: 0.001, decay: 0.05, release: 0.02 }, resonance: 9000, octaves: 1.2,
    }).connect(comp);
    hihat.volume.value = -14;

    const snareBody = new Tone.MembraneSynth({
      pitchDecay: 0.008, octaves: 3,
      envelope: { attack: 0.001, decay: 0.10, sustain: 0, release: 0.05 },
    }).connect(comp);
    snareBody.volume.value = -5;

    const snareWireFilter = new Tone.Filter({ frequency: 2800, type: 'highpass' }).connect(comp);
    const snareWire = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.20, sustain: 0, release: 0.06 },
    }).connect(snareWireFilter);
    snareWire.volume.value = -12;

    const rideHit  = (t: number, v: number) => ride.triggerAttack(t, v);
    const snareHit = (t: number, v: number) => {
      if (v > 0.50) snareBody.triggerAttackRelease('C3', '32n', t, v * 0.8);
      snareWire.triggerAttackRelease('32n', t, v);
    };

    drumKitRef.current = { ride, rideRev, hihat, snareBody, snareWire, snareWireFilter, rideHit, snareHit, warmth, comp, bus };
  }

  // Drum Part — temps "0:beat:2" (croche droite), swing ajouté dans le callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildDrumPart(Tone: any, bpmVal: number, kit: any): any {
    const swingLag = (DRUM_SWING - 0.5) * (60 / bpmVal); // décalage swing en secondes

    type DE = { time: string; hit: string; vel: number; isUp: boolean };
    const events: DE[] = [];

    for (let step = 0; step < 8; step++) {
      const beat  = Math.floor(step / 2);
      const isUp  = step % 2 === 1;
      const time  = isUp ? `0:${beat}:2` : `0:${beat}:0`;

      const r: string = DRUM_PAT.ride[step];
      if (r !== '.') events.push({ time, hit: 'ride',  vel: DRUM_VEL[r], isUp });
      const h: string = DRUM_PAT.hihat[step];
      if (h !== '.') events.push({ time, hit: 'hihat', vel: DRUM_VEL[h], isUp });
      const s: string = DRUM_PAT.snare[step];
      if (s !== '.') events.push({ time, hit: 'snare', vel: DRUM_VEL[s], isUp });
    }

    const part = new (Tone.Part as any)(
      (time: number, val: DE) => {
        const t = val.isUp ? time + swingLag : time;
        if (val.hit === 'ride')  kit.rideHit(t, val.vel);
        if (val.hit === 'hihat') kit.hihat.triggerAttackRelease('16n', t, val.vel);
        if (val.hit === 'snare') kit.snareHit(t, val.vel);
      },
      events,
    );
    part.loop    = true;
    part.loopEnd = '1:0:0'; // 1 mesure
    part.start(0);
    return part;
  }

  // ── Play / Stop ─────────────────────────────────────────────────────────────
  async function togglePlay() {
    if (status === 'playing' || status === 'counting') {
      const Tone = await import('tone');
      playIdRef.current++;
      partRef.current?.stop(0);
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.position = '0:0:0';
      setStatus('idle'); setCurrentFlat(null); setCountBeat(null);
      return;
    }
    try {
      const Tone = await import('tone');
      await Tone.start();

      if (!loadedRef.current) {
        setStatus('loading');

        // Piano (Salamander) — required, fail if missing
        const pianoRev = new Tone.Reverb({ decay: 2.8, wet: 0.20 }).toDestination();
        await new Promise<void>((res, rej) => {
          samplerRef.current = new Tone.Sampler({
            urls: SAMPLE_MAP, baseUrl: BASE_URL, release: 2.5,
            onload: res, onerror: rej,
          }).connect(pianoRev);
        });
        samplerRef.current.volume.value = (pianoVol / 100) * 20 - 20;

        // Contrebasse (FluidR3) — non-fatal, falls back to triangle synth
        const bassRev = new Tone.Reverb({ decay: 1.5, wet: 0.08 }).toDestination();
        await new Promise<void>(resolve => {
          const s = new Tone.Sampler({
            urls: BASS_MAP, baseUrl: BASS_URL, release: 2.0,
            onload: () => { bassSamplerRef.current = s; resolve(); },
            onerror: () => {
              try { s.dispose(); } catch {}
              // Fallback: triangle synth
              const synth = new Tone.Synth({
                oscillator: { type: 'triangle' },
                envelope: { attack: 0.025, decay: 0.55, sustain: 0.04, release: 0.4 },
              }).connect(bassRev);
              synth.volume.value = -4;
              bassSamplerRef.current = synth;
              resolve();
            },
          }).connect(bassRev);
        });
        if (bassSamplerRef.current?.volume)
          bassSamplerRef.current.volume.value = (bassVol / 100) * 20 - 20;

        loadedRef.current = true;
      }

      // Vider la file Transport avant de tout scheduler
      Tone.Transport.cancel();

      // Chord part — jazz swing comping
      const { events, totalBeats } = buildEvents(bars);
      const playId = ++playIdRef.current;
      partRef.current?.dispose();

      // Build comping events: shell voicing on beat 2, upper on beat 3, anticipation on beat 4
      // Beat 1 stays free for the walking bass
      type PV = { time: string; notes: string[] | null; dur: string; vel: number; flatIdx: number | null };
      const compEvents: PV[] = [];
      events.forEach(ev => {
        const n = ev.chord.notes; // [root, 3rd/m3, 5th, 7th]
        // Marker on beat 1 (chord highlight only, no notes)
        compEvents.push({ time: bt(ev.beatStart), notes: null, dur: '', vel: 0, flatIdx: ev.flatIdx });

        if (ev.chord.beats >= 4) {
          // Pattern cycles every 4 bars
          getCompHits(ev.barIdx, n).forEach(hit =>
            compEvents.push({ time: bt(ev.beatStart + hit.beatOffset), notes: hit.notes, dur: hit.dur, vel: hit.vel, flatIdx: null })
          );
        } else {
          // 2-beat chord: one hit on beat 1
          compEvents.push({ time: bt(ev.beatStart), notes: n, dur: '2n', vel: 0.72, flatIdx: null });
        }
      });

      partRef.current = new (Tone.Part as any)(
        (time: number, val: PV) => {
          if (val.flatIdx !== null) {
            const ms = Math.max(0, (time - Tone.now()) * 1000);
            setTimeout(() => { if (playIdRef.current === playId) setCurrentFlat(val.flatIdx!); }, ms);
          }
          if (val.notes) {
            val.notes.forEach((note, i) =>
              samplerRef.current.triggerAttackRelease(note, val.dur, time + i * 0.015, val.vel)
            );
          }
        },
        compEvents,
      );
      partRef.current.loop = true;
      partRef.current.loopEnd = bt(totalBeats);
      partRef.current.start(0);

      // Drum kit (instruments) + drum Part + walking bass
      buildDrums(Tone, drumVol, drumOn);
      const drumPart = buildDrumPart(Tone, bpm, drumKitRef.current);
      drumKitRef.current.drumPart = drumPart;
      const { bassPart } = buildWalkingBass(Tone, events, totalBeats, bassSamplerRef.current);
      drumKitRef.current.bassPart = bassPart;

      // Count-in: synth click dédié (indépendant du drum kit pour éviter les conflits de scheduling)
      const beatDur = 60 / bpm;
      setStatus('counting');
      const clicker = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.01 },
      }).toDestination();
      clicker.volume.value = -8;
      for (let i = 0; i < 4; i++) {
        const t = Tone.now() + 0.10 + i * beatDur;
        clicker.triggerAttack(i === 0 ? 'C5' : 'G4', t, i === 0 ? 0.9 : 0.6);
        setTimeout(() => setCountBeat(4 - i), (i * beatDur) * 1000);
      }
      const startIn = 4 * beatDur + 0.10;
      setTimeout(() => clicker.dispose(), (startIn + 0.5) * 1000);
      Tone.Transport.bpm.value = bpm;
      Tone.Transport.start(`+${startIn}`);
      setTimeout(() => { setCountBeat(null); setStatus('playing'); }, startIn * 1000);
    } catch (e) {
      console.warn('Audio error:', e);
      setStatus('idle');
    }
  }

  function changeBpm(v: number) {
    setBpm(v);
    import('tone').then(T => { T.Transport.bpm.value = v; });
  }

  function changePianoVol(v: number) {
    setPianoVol(v);
    if (samplerRef.current) samplerRef.current.volume.value = (v / 100) * 20 - 20;
  }

  function changeBassVol(v: number) {
    setBassVol(v);
    if (bassSamplerRef.current?.volume) bassSamplerRef.current.volume.value = (v / 100) * 20 - 20;
  }

  function changeDrumVol(v: number) {
    setDrumVol(v);
    if (drumKitRef.current) drumKitRef.current.bus.gain.value = drumOn ? v / 100 : 0;
  }

  function toggleDrum() {
    setDrumOn(prev => {
      const next = !prev;
      if (drumKitRef.current) drumKitRef.current.bus.gain.value = next ? drumVol / 100 : 0;
      return next;
    });
  }

  // ── Chord editing ───────────────────────────────────────────────────────────
  function openEdit(barIdx: number, chordIdx: number) {
    if (status === 'playing' || status === 'counting') return;
    const c = bars[barIdx][chordIdx];
    setEditRoot(c.rootIdx); setEditType(c.type);
    setEditCell({ barIdx, chordIdx });
  }

  function applyEdit() {
    if (!editCell) return;
    const newChord = buildChord(editRoot, editType, bars[editCell.barIdx][editCell.chordIdx].beats);
    setBars(prev => prev.map((bar, bi) =>
      bi !== editCell.barIdx ? bar : bar.map((c, ci) => ci !== editCell.chordIdx ? c : newChord)
    ));
    setEditCell(null);
  }

  // ── Bar structure ───────────────────────────────────────────────────────────
  function splitBar(barIdx: number) {
    setBars(prev => prev.map((bar, bi) => {
      if (bi !== barIdx || bar.length !== 1) return bar;
      return [{ ...bar[0], beats: 2 }, { ...bar[0], beats: 2 }];
    }));
    setEditCell({ barIdx, chordIdx: 0 });
  }

  function mergeBar(barIdx: number) {
    setBars(prev => prev.map((bar, bi) =>
      bi === barIdx && bar.length > 1 ? [{ ...bar[0], beats: 4 }] : bar
    ));
    setEditCell(null);
  }

  // ── Archive ─────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!saveName.trim()) return;
    const name = saveName.trim();
    setSaving(true); setSaveError(null);
    try {
      const wrapped = bars.map(bar => ({ chords: bar.map(({ rootIdx, type, beats }) => ({ rootIdx, type, beats })) }));
      if (user) {
        await saveGridToDb(user.uid, name, wrapped, saveKey.trim() || undefined, saveTips.trim() || undefined);
      } else {
        const stored = JSON.parse(localStorage.getItem('arpegios-grids') ?? '[]');
        stored.push({ id: Date.now().toString(), uid: '', name, key: saveKey.trim() || undefined, tips: saveTips.trim() || undefined, bars: wrapped, savedAt: new Date().toISOString() });
        localStorage.setItem('arpegios-grids', JSON.stringify(stored));
        setSavedGrids(stored);
      }
      setSaveName(''); setSaveKey(''); setSaveTips(''); setShowSaveInput(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('Save failed:', e);
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }

  function loadGrid(grid: GridDoc) {
    if (status !== 'idle') return;
    setBars(grid.bars.map(bar => bar.chords.map(sc => buildChord(sc.rootIdx, sc.type, sc.beats))));
    setTitle(grid.name);
    setGridKey(grid.key ?? '');
    setGridTips(grid.tips ?? '');
    setTransposeOffset(0);
    setEditCell(null);
  }

  async function handleDelete(id: string) {
    await deleteGridToDb(id);
  }

  // ── Transpose ────────────────────────────────────────────────────────────────
  function transpose(semitones: number) {
    if (status !== 'idle') return;
    setBars(prev => prev.map(bar =>
      bar.map(chord => buildChord((chord.rootIdx + semitones + 12) % 12, chord.type, chord.beats))
    ));
    setTransposeOffset(prev => prev + semitones);
  }

  // ── Import ───────────────────────────────────────────────────────────────────
  function handleParseImport() {
    setImportPreview(importFromText(importText));
  }

  function handleConfirmImport() {
    if (!importPreview || status !== 'idle') return;
    setBars(importPreview.bars);
    setTitle(importPreview.title);
    setGridKey(''); setGridTips(''); setTransposeOffset(0);
    setImportPreview(null); setImportText(''); setShowImport(false); setEditCell(null);
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
  function barOfFlat(flat: number | null) {
    if (flat === null) return null;
    let count = 0;
    for (let b = 0; b < bars.length; b++) { count += bars[b].length; if (flat < count) return b; }
    return null;
  }
  const currentBar = barOfFlat(currentFlat);
  const barFlatOffset: number[] = [];
  let off = 0;
  bars.forEach(bar => { barFlatOffset.push(off); off += bar.length; });

  const canEdit = status === 'idle';

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8 pb-32">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm">← Retour</Link>
          <div className="flex items-baseline gap-3 flex-wrap mt-2">
            <h1 className="text-3xl font-bold">{title}</h1>
            {gridKey && <span className="text-sm text-orange-300 font-medium">{gridKey}</span>}
            {transposeOffset !== 0 && (
              <span className="text-xs text-indigo-400 font-mono">
                {transposeOffset > 0 ? `+${transposeOffset}` : transposeOffset} demi-ton{Math.abs(transposeOffset) > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-400 mt-1">
            {bars.length} mesures · boucle
            {canEdit && <span className="ml-2 text-xs text-orange-400">— clic sur un accord pour l'éditer</span>}
          </p>
          {gridTips && (
            <p className="mt-2 text-xs text-gray-300 bg-gray-800 rounded-xl px-3 py-2 border-l-2 border-orange-500">
              {gridTips}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <button onClick={togglePlay} disabled={status === 'loading'}
              className={`px-7 py-3 rounded-xl font-bold text-sm transition-all min-w-[130px] ${
                status === 'playing' || status === 'counting'
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : status === 'loading'
                  ? 'bg-gray-600 text-gray-400 cursor-wait'
                  : 'bg-green-600 hover:bg-green-500 text-white'
              }`}>
              {status === 'loading'  ? '⏳ Chargement…'  :
               status === 'counting' ? `${countBeat ?? ''}  ▶` :
               status === 'playing'  ? '⏹ Stop' : '▶ Play'}
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-[130px]">
              <span className="text-xs text-gray-400 uppercase tracking-wider shrink-0">BPM</span>
              <input type="range" min={50} max={220} value={bpm}
                onChange={e => changeBpm(+e.target.value)}
                className="flex-1 accent-orange-500" />
              <span className="font-mono font-bold w-10 text-right">{bpm}</span>
            </div>

            {status === 'playing' && currentFlat !== null && (
              <span className="text-sm font-bold text-orange-400 animate-pulse ml-auto">
                ● {bars[currentBar!].find((_, ci) => barFlatOffset[currentBar!] + ci === currentFlat)?.name}
              </span>
            )}
          </div>

          {/* Mixer — 3 pistes séparées */}
          <div className="border-t border-gray-700 pt-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider w-full">Mixeur</p>
              {[
                { label: '🎹 Piano',  val: pianoVol, fn: changePianoVol, color: 'accent-amber-500' },
                { label: '🎸 Basse',  val: bassVol,  fn: changeBassVol,  color: 'accent-blue-500'  },
              ].map(({ label, val, fn, color }) => (
                <div key={label} className="flex items-center gap-2 flex-1 min-w-[140px]">
                  <span className="text-[10px] text-gray-400 shrink-0 w-16">{label}</span>
                  <input type="range" min={0} max={100} value={val}
                    onChange={e => fn(+e.target.value)}
                    className={`flex-1 ${color}`} />
                  <span className="font-mono text-[10px] text-gray-500 w-6 text-right">{val}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                <button onClick={toggleDrum}
                  className={`text-[10px] font-bold px-2 py-1 rounded border transition-all shrink-0 w-16 ${
                    drumOn ? 'bg-indigo-700 border-indigo-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'
                  }`}>
                  🥁 {drumOn ? 'ON' : 'OFF'}
                </button>
                {drumOn && (<>
                  <input type="range" min={0} max={100} value={drumVol}
                    onChange={e => changeDrumVol(+e.target.value)}
                    className="flex-1 accent-indigo-500" />
                  <span className="font-mono text-[10px] text-gray-500 w-6 text-right">{drumVol}</span>
                </>)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
              <span className="text-[10px] text-gray-500 mr-1">Transposer</span>
              {[-2,-1,1,2].map(s => (
                <button key={s} onClick={() => transpose(s)} disabled={status !== 'idle'}
                  className="w-8 h-7 rounded text-xs font-bold bg-gray-700 hover:bg-indigo-700 text-gray-300 hover:text-white disabled:opacity-30 transition-colors">
                  {s > 0 ? `+${s}` : s}
                </button>
              ))}
              {transposeOffset !== 0 && (
                <button onClick={() => transpose(-transposeOffset)} disabled={status !== 'idle'}
                  className="px-2 h-7 rounded text-[10px] bg-indigo-900 hover:bg-red-900 text-indigo-300 hover:text-white disabled:opacity-30 transition-colors ml-1">
                  ↩ 0
                </button>
              )}
          </div>
        </div>

        {/* Chord grid — 4 cols mobile / 8 cols desktop */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Grille</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
            {bars.map((bar, barIdx) => {
              const isActiveBar = currentBar === barIdx;
              const isEditBar   = editCell?.barIdx === barIdx;
              return (
                <div key={barIdx}
                  className={`rounded-lg border p-1.5 min-h-[54px] transition-all duration-100 ${
                    isActiveBar ? 'border-orange-400 bg-gray-700 shadow-lg shadow-orange-900/40 scale-105' :
                    isEditBar   ? 'border-orange-300 bg-gray-700' :
                                  'border-gray-700 bg-gray-900'
                  }`}>
                  <p className="text-[8px] text-gray-600 mb-1">{barIdx + 1}</p>
                  <div className="space-y-0.5">
                    {bar.map((chord, ci) => {
                      const flatIdx  = barFlatOffset[barIdx] + ci;
                      const isActive  = currentFlat === flatIdx;
                      const isEditing = editCell?.barIdx === barIdx && editCell.chordIdx === ci;
                      return (
                        <button key={ci} onClick={() => openEdit(barIdx, ci)}
                          className={`w-full text-left text-[10px] font-bold px-1 py-0.5 rounded border transition-all ${
                            isEditing ? 'border-orange-400 bg-orange-900/40 text-orange-200' :
                            isActive  ? COL_ACTIVE[chord.type] :
                            canEdit   ? 'border-gray-700 hover:border-gray-500 ' + (COL_IDLE[chord.type] ?? 'text-gray-400') :
                                        'bg-transparent border-transparent ' + (COL_IDLE[chord.type] ?? 'text-gray-400')
                          } ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}>
                          {chord.name}
                          {bar.length > 1 && <span className="text-[7px] opacity-40 ml-0.5">{chord.beats}t</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Archive */}
        <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Mes grilles</p>
            <button onClick={() => { setShowSaveInput(v => !v); setShowImport(false); }}
              className="ml-auto px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs text-white transition-colors">
              💾 Sauvegarder
            </button>
            <button onClick={() => { setShowImport(v => !v); setShowSaveInput(false); setImportPreview(null); }}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs text-white transition-colors">
              📥 Importer
            </button>
            <button onClick={() => { if (status === 'idle') { setBars(INITIAL); setTitle('Fly Me to the Moon'); setGridKey(''); setGridTips(''); setTransposeOffset(0); } }}
              disabled={status !== 'idle'}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs text-gray-300 transition-colors disabled:opacity-40">
              ↩ Fly Me
            </button>
          </div>

          {showSaveInput && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input value={saveName} onChange={e => setSaveName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  placeholder="Nom du morceau…"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400" />
                <button onClick={handleSave} disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm font-bold text-white transition-colors disabled:opacity-60">
                  {saving ? '…' : 'OK'}
                </button>
                <button onClick={() => { setShowSaveInput(false); setSaveError(null); setSaveKey(''); setSaveTips(''); }}
                  className="px-3 py-1.5 rounded-lg bg-gray-700 text-sm text-gray-400 hover:text-white transition-colors">
                  ✕
                </button>
              </div>
              <input value={saveKey} onChange={e => setSaveKey(e.target.value)}
                placeholder="Tonalité (ex: La mineur, Fa majeur…)"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400" />
              <textarea value={saveTips} onChange={e => setSaveTips(e.target.value)}
                rows={2} placeholder="Conseils sur la grille (approche, difficultés, substitutions…)"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400 resize-none" />
            </div>
          )}
          {saveError && <p className="text-xs text-red-400">{saveError}</p>}

          {showImport && (
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Format : <code className="bg-gray-700 px-1 rounded"># Titre</code> puis{' '}
                <code className="bg-gray-700 px-1 rounded">| Am7 | Dm7 | G7 | Cmaj7 |</code> — plusieurs accords par mesure séparés par espace.
              </p>
              <textarea
                value={importText} onChange={e => setImportText(e.target.value)}
                rows={5} placeholder={"# Mon standard\n| Am7 | Dm7 | G7 | Cmaj7 |\n| Fmaj7 | Bm7b5 E7 | Am7 | E7 |"}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 font-mono outline-none focus:border-orange-400 resize-y" />
              {importPreview && (
                <div className="bg-gray-900 rounded-lg p-3 text-xs space-y-1">
                  <p className="text-orange-300 font-bold">{importPreview.title}</p>
                  <p className="text-gray-400">{importPreview.bars.length} mesures · {importPreview.bars.flat().map(c => c.name).join('  ')}</p>
                  <button onClick={handleConfirmImport} disabled={status !== 'idle'}
                    className="mt-1 px-4 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white font-bold text-xs disabled:opacity-40 transition-colors">
                    ✓ Charger cette grille
                  </button>
                </div>
              )}
              {!importPreview && (
                <div className="flex gap-2">
                  <button onClick={handleParseImport}
                    className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-colors">
                    Analyser
                  </button>
                  <button onClick={() => { setShowImport(false); setImportText(''); }}
                    className="px-3 py-1.5 rounded-lg bg-gray-700 text-xs text-gray-400 hover:text-white transition-colors">
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}

          {!user && <p className="text-xs text-gray-600 italic">Connexion en cours…</p>}
          {user && savedGrids.length === 0 && (
            <p className="text-xs text-gray-600 italic">Aucune grille sauvegardée.</p>
          )}
          {user && savedGrids.length > 0 && (
            <div className="space-y-1.5">
              {savedGrids.map(g => (
                <div key={g.id} className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-white font-medium">{g.name}</span>
                      {g.key && <span className="text-xs text-orange-400">{g.key}</span>}
                      <span className="text-xs text-gray-600">{g.bars.length} mes.</span>
                    </div>
                    {g.tips && <p className="text-xs text-gray-500 truncate mt-0.5">{g.tips}</p>}
                  </div>
                  <button onClick={() => loadGrid(g)} disabled={status !== 'idle'}
                    className="px-2.5 py-1 rounded text-xs bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-40 transition-colors">
                    Charger
                  </button>
                  {(!g.uid || g.uid === user?.uid) && (
                    <button onClick={() => handleDelete(g.id)}
                      className="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-red-800 text-gray-400 hover:text-white transition-colors">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(COL_ACTIVE).map(([type, cls]) => (
            <span key={type} className={`px-2.5 py-1 rounded-lg border ${cls}`}>{type}</span>
          ))}
        </div>

      </div>

      {/* ── Edit panel — sticky bottom ─────────────────────────────────────── */}
      {editCell && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50 shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Header row */}
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm font-semibold text-white">
                Mesure {editCell.barIdx + 1}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded border ${COL_ACTIVE[editType] ?? ''}`}>
                  {NOTES[editRoot]}{TYPE_SYM[editType]}
                </span>
              </p>

              {/* Split / Merge */}
              {bars[editCell.barIdx].length === 1 ? (
                <button onClick={() => splitBar(editCell.barIdx)}
                  title="Diviser la mesure en 2 accords (2+2 temps)"
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-700 hover:bg-blue-700 text-gray-300 hover:text-white border border-gray-600 transition-all">
                  ÷2 Diviser
                </button>
              ) : (
                <button onClick={() => mergeBar(editCell.barIdx)}
                  title="Fusionner en 1 accord (4 temps)"
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-700 hover:bg-red-800 text-gray-300 hover:text-white border border-gray-600 transition-all">
                  ⊕ Fusionner
                </button>
              )}

              <button onClick={() => setEditCell(null)} className="ml-auto text-gray-400 hover:text-white text-lg leading-none">✕</button>
            </div>

            {/* Root selector */}
            <div className="flex gap-1 flex-wrap">
              {NOTES.map((n, i) => (
                <button key={i} onClick={() => setEditRoot(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all border ${
                    editRoot === i
                      ? 'bg-orange-500 border-orange-400 text-white scale-110'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}>
                  {n}
                </button>
              ))}
            </div>

            {/* Type selector + Apply */}
            <div className="flex gap-1.5 flex-wrap items-center">
              {TYPES.map(t => (
                <button key={t} onClick={() => setEditType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    editType === t
                      ? (COL_ACTIVE[t] ?? 'bg-orange-600 border-orange-400 text-white') + ' scale-105'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                  }`}>
                  {NOTES[editRoot]}{TYPE_SYM[t]}
                </button>
              ))}
              <button onClick={applyEdit}
                className="ml-auto px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm transition-colors">
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
