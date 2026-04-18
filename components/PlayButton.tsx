'use client';
import { useState, useRef, useEffect } from 'react';
import { getArpeggioVoicing2Oct, ArpeggioType, HarmonyMode } from '@/lib/music';

interface Props {
  keyNote: number;
  degreeIndex: number;
  arpeggioType: ArpeggioType;
  mode: HarmonyMode;
}

// Converts Hz to Tone.js note name (e.g. "C4", "F#3")
function freqToNote(freq: number): string {
  const NOTE = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const midi = Math.round(12 * Math.log2(freq / 440) + 69);
  return `${NOTE[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

const BASE_URL = 'https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/';
const SAMPLE_MAP: Record<string, string> = {
  A1:'A1.mp3', A2:'A2.mp3', A3:'A3.mp3', A4:'A4.mp3',
  C2:'C2.mp3', C3:'C3.mp3', C4:'C4.mp3', C5:'C5.mp3',
  'D#2':'Ds2.mp3','D#3':'Ds3.mp3','D#4':'Ds4.mp3',
  'F#2':'Fs2.mp3','F#3':'Fs3.mp3','F#4':'Fs4.mp3',
};

export default function PlayButton({ keyNote, degreeIndex, arpeggioType, mode }: Props) {
  const [state, setState] = useState<'idle'|'loading'|'playing'>('idle');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const samplerRef = useRef<any>(null);
  const loadedRef  = useRef(false);

  useEffect(() => {
    return () => { samplerRef.current?.dispose(); };
  }, []);

  async function play() {
    if (state === 'playing') return;

    const Tone = await import('tone');
    await Tone.start();

    if (!loadedRef.current) {
      setState('loading');
      const reverb = new Tone.Reverb({ decay: 2.2, wet: 0.22 }).toDestination();
      const comp   = new Tone.Compressor(-18, 4).connect(reverb);

      samplerRef.current = new Tone.Sampler({
        urls: SAMPLE_MAP,
        baseUrl: BASE_URL,
        release: 2.5,
        onload: () => { loadedRef.current = true; startPlay(Tone); },
      }).connect(comp);
    } else {
      startPlay(Tone);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function startPlay(Tone: any) {
    setState('playing');
    const voicing = getArpeggioVoicing2Oct(keyNote, degreeIndex, mode);
    const now = Tone.now() + 0.05;

    voicing.forEach((v, i) => {
      samplerRef.current.triggerAttackRelease(freqToNote(v.freq), '2n', now + i * 0.2);
    });

    setTimeout(() => setState('idle'), voicing.length * 200 + 2000);
  }

  const label = state === 'loading' ? 'Chargement…' : state === 'playing' ? 'En cours…' : 'Écouter (2 oct.)';
  const icon  = state === 'playing' ? '♪' : '▶';

  return (
    <button onClick={play} disabled={state === 'loading'}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all
        ${state === 'playing'  ? 'bg-green-600 text-white scale-95' :
          state === 'loading'  ? 'bg-gray-600 text-gray-400 cursor-wait' :
                                 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105'}`}>
      <span>{icon}</span>
      {label}
    </button>
  );
}
