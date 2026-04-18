'use client';
import { useState, useRef, useEffect } from 'react';
import { getArpeggioVoicing2Oct, ArpeggioType, HarmonyMode } from '@/lib/music';

interface Props {
  keyNote: number;
  degreeIndex: number;
  arpeggioType: ArpeggioType;
  mode: HarmonyMode;
}

function freqToNote(freq: number): string {
  const NOTE = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const midi = Math.round(12 * Math.log2(freq / 440) + 69);
  return `${NOTE[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

// Official Tone.js Salamander Grand Piano samples
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

export default function PlayButton({ keyNote, degreeIndex, arpeggioType, mode }: Props) {
  const [state, setState] = useState<'idle'|'loading'|'playing'>('idle');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const samplerRef = useRef<any>(null);
  const loadedRef  = useRef(false);

  useEffect(() => {
    return () => { samplerRef.current?.dispose(); };
  }, []);

  async function play() {
    if (state !== 'idle') return;

    try {
      const Tone = await import('tone');
      await Tone.start();

      if (!loadedRef.current) {
        setState('loading');
        const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.2 }).toDestination();

        samplerRef.current = new Tone.Sampler({
          urls: SAMPLE_MAP,
          baseUrl: BASE_URL,
          release: 3,
          onload: () => {
            loadedRef.current = true;
            startPlay(Tone);
          },
          onerror: (e) => {
            console.warn('Sampler load error:', e);
            setState('idle');
          },
        }).connect(reverb);
      } else {
        startPlay(Tone);
      }
    } catch (e) {
      console.warn('Audio error:', e);
      setState('idle');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function startPlay(Tone: any) {
    setState('playing');
    const voicing = getArpeggioVoicing2Oct(keyNote, degreeIndex, mode);
    const now = Tone.now() + 0.05;

    voicing.forEach((v, i) => {
      samplerRef.current.triggerAttackRelease(freqToNote(v.freq), '2n', now + i * 0.22);
    });

    setTimeout(() => setState('idle'), voicing.length * 220 + 2500);
  }

  const label = state === 'loading' ? 'Chargement…' : state === 'playing' ? 'En cours…' : 'Écouter (2 oct.)';
  const icon  = state === 'playing' ? '♪' : '▶';

  return (
    <button onClick={play} disabled={state !== 'idle'}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all
        ${state === 'playing'  ? 'bg-green-600 text-white scale-95' :
          state === 'loading'  ? 'bg-gray-600 text-gray-400 cursor-wait' :
                                 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105'}`}>
      <span>{icon}</span>
      {label}
    </button>
  );
}
