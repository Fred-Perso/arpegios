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

export default function PlayButton({ keyNote, degreeIndex, arpeggioType, mode }: Props) {
  const [state, setState] = useState<'idle'|'loading'|'playing'>('idle');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const synthRef = useRef<any>(null);

  useEffect(() => {
    return () => { synthRef.current?.dispose(); };
  }, []);

  async function play() {
    if (state !== 'idle') return;
    setState('loading');

    try {
      const Tone = await import('tone');
      await Tone.start();

      if (!synthRef.current) {
        const reverb = new Tone.Reverb({ decay: 1.8, wet: 0.18 }).toDestination();
        synthRef.current = new Tone.PluckSynth({
          attackNoise: 1.2,
          dampening: 4000,
          resonance: 0.96,
        }).connect(reverb);
      }

      setState('playing');
      const voicing = getArpeggioVoicing2Oct(keyNote, degreeIndex, mode);
      const now = Tone.now() + 0.05;

      voicing.forEach((v, i) => {
        synthRef.current.triggerAttack(freqToNote(v.freq), now + i * 0.22);
      });

      setTimeout(() => setState('idle'), voicing.length * 220 + 1800);
    } catch (e) {
      console.warn('Audio error:', e);
      setState('idle');
    }
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
