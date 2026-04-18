'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────
type Chord     = { name: string; notes: string[]; beats: number; type: string; rootIdx: number };
type SavedGrid = { name: string; bars: Chord[][]; savedAt: string };

// ─── Piano ───────────────────────────────────────────────────────────────────
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

// ─── Drum patterns — 12 triplet-8th steps per bar ────────────────────────────
// Layout: [beat1-down, beat1-mid, beat1-up,  beat2-down, …,  beat4-down, beat4-mid, beat4-up]
// Ride: strong downbeats (long) / soft upbeats (short) → long-short shuffle
const RIDE_PAT  = [0.95, null, 0.38,  0.82, null, 0.36,  0.92, null, 0.38,  0.80, null, 0.35];
// Hi-hat foot on 2 & 4 (stays on-beat — anchors time)
const HIHAT_PAT = [null, null, null,  0.92, null, null,  null, null, null,  0.90, null, null];
// Kick: lazy beat 1, ghost on beat 3 (pocket feel)
const KICK_PAT  = [0.88, null, null,  null, null, null,  0.42, null, null,  null, null, null];
// Snare: accents 2&4 + soft ghost on upbeat 2 & 4 (shuffle "cha-KA")
const SNARE_PAT = [null, null, null,  0.72, null, 0.22,  null, null, null,  0.70, null, 0.20];

// ─── Initial chart: Fly Me to the Moon ───────────────────────────────────────
const INITIAL: Chord[][] = [
  [buildChord(9,'m7')],  [buildChord(2,'m7')],   [buildChord(7,'Dom7')], [buildChord(0,'Maj7')],
  [buildChord(5,'Maj7')],[buildChord(11,'m7b5',2),buildChord(4,'Dom7',2)],
  [buildChord(9,'m7')],  [buildChord(4,'Dom7')],
  [buildChord(9,'m7')],  [buildChord(2,'m7')],   [buildChord(7,'Dom7')], [buildChord(0,'Maj7')],
  [buildChord(5,'Maj7')],[buildChord(11,'m7b5',2),buildChord(4,'Dom7',2)],
  [buildChord(9,'m7')],  [buildChord(9,'m7')],
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

// ─── Component ───────────────────────────────────────────────────────────────
export default function AccompagnementPage() {
  const [status,       setStatus]       = useState<'idle'|'loading'|'counting'|'playing'>('idle');
  const [countBeat,    setCountBeat]    = useState<number | null>(null);
  const [bpm,          setBpm]          = useState(120);
  const [currentFlat,  setCurrentFlat]  = useState<number | null>(null);
  const [drumOn,       setDrumOn]       = useState(true);
  const [drumVol,      setDrumVol]      = useState(65);
  const [bars,         setBars]         = useState<Chord[][]>(INITIAL);
  const [editCell,     setEditCell]     = useState<{ barIdx: number; chordIdx: number } | null>(null);
  const [editRoot,     setEditRoot]     = useState(9);
  const [editType,     setEditType]     = useState('m7');
  const [savedGrids,   setSavedGrids]   = useState<SavedGrid[]>([]);
  const [saveName,     setSaveName]     = useState('');
  const [showSaveInput,setShowSaveInput]= useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const samplerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const partRef    = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drumKitRef = useRef<any>(null);
  const loadedRef  = useRef(false);
  const playIdRef  = useRef(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('arpegios-grids') ?? '[]');
    setSavedGrids(saved);
    return () => { partRef.current?.dispose(); samplerRef.current?.dispose(); disposeDrums(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Drum kit ────────────────────────────────────────────────────────────────
  function disposeDrums() {
    const k = drumKitRef.current;
    if (!k) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    k.seqs?.forEach((s: any) => { try { s.stop(0); s.dispose(); } catch {} });
    ['ride','hihat','kick','snare','bus'].forEach(x => { try { k[x]?.dispose(); } catch {} });
    drumKitRef.current = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildDrums(Tone: any, vol: number, enabled: boolean) {
    disposeDrums();
    const bus = new Tone.Gain(enabled ? vol / 100 : 0).toDestination();

    const ride = new Tone.MetalSynth({
      frequency:380, harmonicity:5.1, modulationIndex:16,
      envelope:{attack:0.001,decay:0.55,release:0.3}, resonance:3800, octaves:1.2,
    }).connect(bus);
    ride.volume.value = -5;

    const hihat = new Tone.MetalSynth({
      frequency:1100, harmonicity:5.1, modulationIndex:12,
      envelope:{attack:0.001,decay:0.07,release:0.04}, resonance:9000, octaves:1.5,
    }).connect(bus);
    hihat.volume.value = -11;

    const kick = new Tone.MembraneSynth({
      pitchDecay:0.04, octaves:5,
      envelope:{attack:0.001,decay:0.22,sustain:0,release:0.08},
    }).connect(bus);
    kick.volume.value = -3;

    const snare = new Tone.NoiseSynth({
      noise:{type:'white'}, envelope:{attack:0.001,decay:0.10,sustain:0,release:0.04},
    }).connect(bus);
    snare.volume.value = -15;

    // lag (seconds) = "laid-back behind the beat" per instrument
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seq = (pat: (number|null)[], hit: (t:number,v:number)=>void, lag=0): any => {
      const s = new Tone.Sequence(
        (time: number, vel: number | null) => { if (vel !== null) hit(time + lag, vel); },
        pat, '8t' // triplet 8th notes → authentic swing feel
      );
      s.loop = true; s.start(0); return s;
    };

    const seqs = [
      seq(RIDE_PAT,  (t,v) => ride.triggerAttackRelease('8t',   t, v), 0.018), // ride: laidback
      seq(HIHAT_PAT, (t,v) => hihat.triggerAttackRelease('16n',  t, v), 0),     // hihat: on the beat
      seq(KICK_PAT,  (t,v) => kick.triggerAttackRelease('C1','8n',t, v), 0.020),// kick: lazy pocket
      seq(SNARE_PAT, (t,v) => snare.triggerAttackRelease('16n',  t, v), 0.013), // snare: slightly late
    ];
    drumKitRef.current = { ride, hihat, kick, snare, bus, seqs };
  }

  // ── Play / Stop ─────────────────────────────────────────────────────────────
  async function togglePlay() {
    if (status === 'playing' || status === 'counting') {
      const Tone = await import('tone');
      playIdRef.current++;
      partRef.current?.stop(0);
      drumKitRef.current?.seqs?.forEach((s: any) => s.stop(0));
      Tone.Transport.stop();
      Tone.Transport.position = '0:0:0';
      setStatus('idle'); setCurrentFlat(null); setCountBeat(null);
      return;
    }
    try {
      const Tone = await import('tone');
      await Tone.start();

      if (!loadedRef.current) {
        setStatus('loading');
        const rev = new Tone.Reverb({ decay: 2.8, wet: 0.22 }).toDestination();
        await new Promise<void>((res, rej) => {
          samplerRef.current = new Tone.Sampler({
            urls: SAMPLE_MAP, baseUrl: BASE_URL, release: 2.5,
            onload: () => { loadedRef.current = true; res(); }, onerror: rej,
          }).connect(rev);
        });
      }

      // Chord part
      const { events, totalBeats } = buildEvents(bars);
      const playId = ++playIdRef.current;
      partRef.current?.dispose();
      type PV = { time: string; chord: Chord; flatIdx: number };
      partRef.current = new Tone.Part<PV>(
        (time: number, val: PV) => {
          const dur = val.chord.beats === 4 ? '1n' : '2n';
          val.chord.notes.forEach((n, i) =>
            samplerRef.current.triggerAttackRelease(n, dur, time + i * 0.022)
          );
          const ms = Math.max(0, (time - Tone.now()) * 1000);
          setTimeout(() => { if (playIdRef.current === playId) setCurrentFlat(val.flatIdx); }, ms);
        },
        events.map(ev => ({ time: bt(ev.beatStart), chord: ev.chord, flatIdx: ev.flatIdx }))
      );
      partRef.current.loop = true;
      partRef.current.loopEnd = bt(totalBeats);
      partRef.current.start(0);

      // Drum kit
      buildDrums(Tone, drumVol, drumOn);

      // Count-in: 4 hi-hat clicks then start
      const beatDur = 60 / bpm;
      setStatus('counting');
      for (let i = 0; i < 4; i++) {
        const t = Tone.now() + 0.05 + i * beatDur;
        drumKitRef.current.hihat.triggerAttackRelease('16n', t, i === 0 ? 1.0 : 0.75);
        setTimeout(() => setCountBeat(4 - i), (i * beatDur) * 1000);
      }
      const startIn = 4 * beatDur + 0.05;
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
  function saveGrid() {
    if (!saveName.trim()) return;
    const grid: SavedGrid = { name: saveName.trim(), bars, savedAt: new Date().toISOString() };
    const all = [...savedGrids, grid];
    setSavedGrids(all);
    localStorage.setItem('arpegios-grids', JSON.stringify(all));
    setSaveName(''); setShowSaveInput(false);
  }

  function loadGrid(grid: SavedGrid) {
    if (status !== 'idle') return;
    setBars(grid.bars); setEditCell(null);
  }

  function deleteGrid(idx: number) {
    const all = savedGrids.filter((_, i) => i !== idx);
    setSavedGrids(all);
    localStorage.setItem('arpegios-grids', JSON.stringify(all));
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
          <h1 className="text-3xl font-bold mt-2">Fly Me to the Moon</h1>
          <p className="text-gray-400 mt-1">
            Bart Howard · La mineur · 16 mesures · boucle
            {canEdit && <span className="ml-2 text-xs text-orange-400">— clic sur un accord pour l'éditer</span>}
          </p>
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

          {/* Drum row */}
          <div className="flex flex-wrap gap-3 items-center border-t border-gray-700 pt-3">
            <button onClick={toggleDrum}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                drumOn ? 'bg-indigo-700 border-indigo-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'
              }`}>
              🥁 {drumOn ? 'ON' : 'OFF'}
            </button>
            {drumOn && (
              <div className="flex items-center gap-2 flex-1 min-w-[100px]">
                <span className="text-xs text-gray-400 shrink-0">Vol.</span>
                <input type="range" min={0} max={100} value={drumVol}
                  onChange={e => changeDrumVol(+e.target.value)}
                  className="flex-1 accent-indigo-500" />
                <span className="font-mono text-xs text-gray-400 w-7 text-right">{drumVol}</span>
              </div>
            )}
            <span className="text-[10px] text-gray-600 italic ml-auto">swing ternaire · ride triplet · décompte 4 temps</span>
          </div>
        </div>

        {/* Chord grid */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Grille</p>
          <div className="space-y-2">
            {[0, 1].map(half => (
              <div key={half} className="grid grid-cols-8 gap-1">
                {bars.slice(half * 8, half * 8 + 8).map((bar, offset) => {
                  const barIdx = half * 8 + offset;
                  const isActiveBar = currentBar === barIdx;
                  const isEditBar = editCell?.barIdx === barIdx;
                  return (
                    <div key={barIdx}
                      className={`rounded-lg border p-1.5 min-h-[54px] transition-all duration-100 ${
                        isActiveBar  ? 'border-orange-400 bg-gray-700 shadow-lg shadow-orange-900/40 scale-105' :
                        isEditBar    ? 'border-orange-300 bg-gray-700' :
                                       'border-gray-700 bg-gray-900'
                      }`}>
                      <p className="text-[8px] text-gray-600 mb-1">{barIdx + 1}</p>
                      <div className="space-y-0.5">
                        {bar.map((chord, ci) => {
                          const flatIdx = barFlatOffset[barIdx] + ci;
                          const isActive = currentFlat === flatIdx;
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
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {['A¹ — mes. 1–8', 'A² — mes. 9–16'].map(l => (
              <p key={l} className="text-[9px] text-gray-600 text-center">{l}</p>
            ))}
          </div>
        </div>

        {/* Archive */}
        <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Mes grilles</p>
            <button onClick={() => setShowSaveInput(v => !v)}
              className="ml-auto px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs text-white transition-colors">
              💾 Sauvegarder
            </button>
            <button onClick={() => { if (status === 'idle') setBars(INITIAL); }}
              disabled={status !== 'idle'}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs text-gray-300 transition-colors disabled:opacity-40">
              ↩ Fly Me
            </button>
          </div>

          {showSaveInput && (
            <div className="flex gap-2">
              <input value={saveName} onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveGrid()}
                placeholder="Nom de la grille…"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400" />
              <button onClick={saveGrid}
                className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm font-bold text-white transition-colors">
                OK
              </button>
              <button onClick={() => setShowSaveInput(false)}
                className="px-3 py-1.5 rounded-lg bg-gray-700 text-sm text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
          )}

          {savedGrids.length === 0 ? (
            <p className="text-xs text-gray-600 italic">Aucune grille sauvegardée.</p>
          ) : (
            <div className="space-y-1.5">
              {savedGrids.map((g, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
                  <span className="text-sm text-white flex-1 font-medium">{g.name}</span>
                  <span className="text-xs text-gray-500">{g.bars.length} mes.</span>
                  <button onClick={() => loadGrid(g)} disabled={status !== 'idle'}
                    className="px-2.5 py-1 rounded text-xs bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-40 transition-colors">
                    Charger
                  </button>
                  <button onClick={() => deleteGrid(i)}
                    className="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-red-800 text-gray-400 hover:text-white transition-colors">
                    ✕
                  </button>
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
