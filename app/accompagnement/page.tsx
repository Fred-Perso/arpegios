'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Chord = { name: string; notes: string[]; beats: number; type: string };

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

// Fly Me to the Moon – Am / 16 mesures (A×2)
const BARS: Chord[][] = [
  // — section A1 —
  [{ name: 'Am7',   notes: ['A3','C4','E4','G4'],  beats: 4, type: 'm7'   }],
  [{ name: 'Dm7',   notes: ['D3','F3','A3','C4'],  beats: 4, type: 'm7'   }],
  [{ name: 'G7',    notes: ['G3','B3','D4','F4'],  beats: 4, type: 'Dom7' }],
  [{ name: 'C△7',   notes: ['C4','E4','G4','B4'],  beats: 4, type: 'Maj7' }],
  [{ name: 'F△7',   notes: ['F3','A3','C4','E4'],  beats: 4, type: 'Maj7' }],
  [{ name: 'Bm7b5', notes: ['B3','D4','F4','A4'],  beats: 2, type: 'm7b5' },
   { name: 'E7',    notes: ['E3','G#3','B3','D4'], beats: 2, type: 'Dom7' }],
  [{ name: 'Am7',   notes: ['A3','C4','E4','G4'],  beats: 4, type: 'm7'   }],
  [{ name: 'E7',    notes: ['E3','G#3','B3','D4'], beats: 4, type: 'Dom7' }],
  // — section A2 —
  [{ name: 'Am7',   notes: ['A3','C4','E4','G4'],  beats: 4, type: 'm7'   }],
  [{ name: 'Dm7',   notes: ['D3','F3','A3','C4'],  beats: 4, type: 'm7'   }],
  [{ name: 'G7',    notes: ['G3','B3','D4','F4'],  beats: 4, type: 'Dom7' }],
  [{ name: 'C△7',   notes: ['C4','E4','G4','B4'],  beats: 4, type: 'Maj7' }],
  [{ name: 'F△7',   notes: ['F3','A3','C4','E4'],  beats: 4, type: 'Maj7' }],
  [{ name: 'Bm7b5', notes: ['B3','D4','F4','A4'],  beats: 2, type: 'm7b5' },
   { name: 'E7',    notes: ['E3','G#3','B3','D4'], beats: 2, type: 'Dom7' }],
  [{ name: 'Am7',   notes: ['A3','C4','E4','G4'],  beats: 4, type: 'm7'   }],
  [{ name: 'Am7',   notes: ['A3','C4','E4','G4'],  beats: 4, type: 'm7'   }],
];

type Event = { chord: Chord; barIdx: number; flatIdx: number; beatStart: number };

function buildEvents(): { events: Event[]; totalBeats: number } {
  const events: Event[] = [];
  let beat = 0; let flat = 0;
  BARS.forEach((bar, b) => bar.forEach(chord => {
    events.push({ chord, barIdx: b, flatIdx: flat++, beatStart: beat });
    beat += chord.beats;
  }));
  return { events, totalBeats: beat };
}

// beat → "bars:beats:sixteenths" in 4/4
function bt(beat: number) { return `${Math.floor(beat / 4)}:${beat % 4}:0`; }

const TYPE_ACTIVE: Record<string, string> = {
  Maj7:  'bg-amber-800/80 border-amber-400 text-amber-200',
  m7:    'bg-blue-800/80  border-blue-400  text-blue-200',
  Dom7:  'bg-red-800/80   border-red-400   text-red-200',
  m7b5:  'bg-purple-800/80 border-purple-400 text-purple-200',
};
const TYPE_IDLE: Record<string, string> = {
  Maj7:  'border-amber-900 text-amber-500',
  m7:    'border-blue-900  text-blue-500',
  Dom7:  'border-red-900   text-red-500',
  m7b5:  'border-purple-900 text-purple-500',
};

export default function AccompagnementPage() {
  const [status,      setStatus]      = useState<'idle'|'loading'|'playing'>('idle');
  const [bpm,         setBpm]         = useState(120);
  const [currentFlat, setCurrentFlat] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const samplerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const partRef    = useRef<any>(null);
  const loadedRef  = useRef(false);
  const playIdRef  = useRef(0);

  useEffect(() => () => { partRef.current?.dispose(); samplerRef.current?.dispose(); }, []);

  async function togglePlay() {
    if (status === 'playing') {
      const Tone = await import('tone');
      playIdRef.current++;
      partRef.current?.stop(0);
      Tone.Transport.stop();
      Tone.Transport.position = '0:0:0';
      setStatus('idle');
      setCurrentFlat(null);
      return;
    }

    try {
      const Tone = await import('tone');
      await Tone.start();

      if (!loadedRef.current) {
        setStatus('loading');
        const reverb = new Tone.Reverb({ decay: 2.8, wet: 0.22 }).toDestination();
        await new Promise<void>((resolve, reject) => {
          samplerRef.current = new Tone.Sampler({
            urls: SAMPLE_MAP, baseUrl: BASE_URL, release: 2.5,
            onload: () => { loadedRef.current = true; resolve(); },
            onerror: reject,
          }).connect(reverb);
        });
      }

      const { events, totalBeats } = buildEvents();
      const playId = ++playIdRef.current;

      partRef.current?.dispose();
      partRef.current = new Tone.Part(
        (time: number, val: { chord: Chord; flatIdx: number }) => {
          const dur = val.chord.beats === 4 ? '1n' : '2n';
          // Slight upward roll for natural piano feel
          val.chord.notes.forEach((note, i) => {
            samplerRef.current.triggerAttackRelease(note, dur, time + i * 0.022);
          });
          // Sync visual to audio clock
          const delayMs = Math.max(0, (time - Tone.now()) * 1000);
          setTimeout(() => {
            if (playIdRef.current === playId) setCurrentFlat(val.flatIdx);
          }, delayMs);
        },
        events.map(ev => [bt(ev.beatStart), { chord: ev.chord, flatIdx: ev.flatIdx }])
      );

      partRef.current.loop    = true;
      partRef.current.loopEnd = bt(totalBeats);
      partRef.current.start(0);

      Tone.Transport.bpm.value = bpm;
      Tone.Transport.start();
      setStatus('playing');
    } catch (e) {
      console.warn('Audio error:', e);
      setStatus('idle');
    }
  }

  function changeBpm(v: number) {
    setBpm(v);
    import('tone').then(T => { T.Transport.bpm.value = v; });
  }

  // Derive currentBar from currentFlat
  function barOfFlat(flat: number | null) {
    if (flat === null) return null;
    let count = 0;
    for (let b = 0; b < BARS.length; b++) {
      count += BARS[b].length;
      if (flat < count) return b;
    }
    return null;
  }

  const currentBar = barOfFlat(currentFlat);

  // Pre-compute flat index offset for each bar
  const barFlatOffset: number[] = [];
  let off = 0;
  BARS.forEach(bar => { barFlatOffset.push(off); off += bar.length; });

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm">← Retour</Link>
          <h1 className="text-3xl font-bold mt-2">Fly Me to the Moon</h1>
          <p className="text-gray-400 mt-1">Bart Howard · La mineur · 16 mesures · boucle</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
          <button onClick={togglePlay} disabled={status === 'loading'}
            className={`px-7 py-3 rounded-xl font-bold text-sm transition-all ${
              status === 'playing' ? 'bg-red-600 hover:bg-red-500 text-white' :
              status === 'loading' ? 'bg-gray-600 text-gray-400 cursor-wait' :
                                     'bg-green-600 hover:bg-green-500 text-white'
            }`}>
            {status === 'loading' ? '⏳ Chargement piano…' : status === 'playing' ? '⏹ Stop' : '▶ Play'}
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-[160px]">
            <span className="text-xs text-gray-400 uppercase tracking-wider shrink-0">BPM</span>
            <input type="range" min={50} max={220} value={bpm}
              onChange={e => changeBpm(+e.target.value)}
              className="flex-1 accent-orange-500" />
            <span className="font-mono font-bold text-white w-10 text-right">{bpm}</span>
          </div>

          {status === 'playing' && currentFlat !== null && (
            <div className="ml-auto text-sm font-bold text-orange-400 animate-pulse">
              ● {BARS[currentBar!].find((_, ci) => barFlatOffset[currentBar!] + ci === currentFlat)?.name}
            </div>
          )}
        </div>

        {/* Chord grid */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Grille</p>
          <div className="space-y-2">
            {[0, 1].map(half => (
              <div key={half} className="grid grid-cols-8 gap-1.5">
                {BARS.slice(half * 8, half * 8 + 8).map((bar, offset) => {
                  const barIdx = half * 8 + offset;
                  const isActiveBar = currentBar === barIdx;
                  return (
                    <div key={barIdx}
                      className={`rounded-lg border p-1.5 min-h-[52px] transition-all duration-100 ${
                        isActiveBar
                          ? 'border-orange-400 bg-gray-700 shadow-lg shadow-orange-900/40 scale-105'
                          : 'border-gray-700 bg-gray-900'
                      }`}>
                      <p className="text-[8px] text-gray-600 mb-1">{barIdx + 1}</p>
                      <div className="space-y-0.5">
                        {bar.map((chord, ci) => {
                          const flatIdx = barFlatOffset[barIdx] + ci;
                          const isActive = currentFlat === flatIdx;
                          return (
                            <div key={ci}
                              className={`text-[10px] font-bold px-1 py-0.5 rounded border transition-all ${
                                isActive ? TYPE_ACTIVE[chord.type] : 'bg-transparent border-transparent ' + (TYPE_IDLE[chord.type] ?? 'text-gray-400')
                              }`}>
                              {chord.name}
                              {bar.length > 1 && (
                                <span className="text-[7px] opacity-50 ml-0.5">{chord.beats}t</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Section labels */}
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {['A¹ — mesures 1 à 8', 'A² — mesures 9 à 16'].map(l => (
              <p key={l} className="text-[9px] text-gray-600 text-center">{l}</p>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(TYPE_ACTIVE).map(([type, cls]) => (
            <span key={type} className={`px-2.5 py-1 rounded-lg border ${cls}`}>{type}</span>
          ))}
        </div>

        {/* Practice tips */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-3 text-sm">
          <p className="text-white font-semibold">Comment travailler</p>
          <ul className="text-gray-400 text-xs space-y-2 list-disc list-inside leading-relaxed">
            <li>Lance à <strong className="text-white">70–80 BPM</strong>, écoute la progression, puis joue tes arpèges par-dessus</li>
            <li><strong className="text-white">Mesure 6</strong> : Bm7b5 → E7 changent au milieu (2 temps chacun) — prépare tes doigts</li>
            <li>Essaie la gamme de <strong className="text-white">La mineur mélodique</strong> sur l'ensemble de la grille</li>
            <li>Le Am7 final (mes. 16) repart directement sur Am7 (mes. 1) : c'est le retour de boucle</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
