'use client';
import { useState, useRef } from 'react';
import { FretPosition, fretToFreq, getPositionWindows, getArpeggioPositions, ArpeggioType } from '@/lib/music';

interface Props {
  keyNote: number;
  degreeIndex: number;
  arpeggioType: ArpeggioType;
}

export default function PlayButton({ keyNote, degreeIndex, arpeggioType }: Props) {
  const [playing, setPlaying] = useState(false);
  const cancelRef = useRef(false);

  async function play() {
    if (playing) { cancelRef.current = true; return; }

    // Tone.js dynamic import (client only)
    const Tone = await import('tone');
    await Tone.start();

    const synth = new Tone.PluckSynth({
      attackNoise: 1.5,
      dampening: 3800,
      resonance: 0.92,
    }).toDestination();

    const reverb = new Tone.Reverb({ decay: 1.8, wet: 0.25 }).toDestination();
    synth.connect(reverb);

    // Pick best voicing: first CAGED position window
    const { MAJOR_SCALE_INTERVALS } = await import('@/lib/music');
    const rootSemitone = (keyNote + MAJOR_SCALE_INTERVALS[degreeIndex]) % 12;
    const windows = getPositionWindows(rootSemitone);
    const [wMin, wMax] = windows[0];

    const positions = getArpeggioPositions(keyNote, degreeIndex, wMin, wMax + 2);

    // One note per degree, lowest string first
    const voicing: FretPosition[] = [];
    for (let deg = 0; deg < 4; deg++) {
      const candidates = positions.filter(p => p.degreeIndex === deg);
      if (candidates.length > 0) {
        // Pick lowest fret (most open sound)
        voicing.push(candidates.reduce((a, b) => a.fret <= b.fret ? a : b));
      }
    }

    // Sort by string (low E → high e)
    voicing.sort((a, b) => a.string !== b.string ? a.string - b.string : a.fret - b.fret);

    cancelRef.current = false;
    setPlaying(true);

    const now = Tone.now();
    voicing.forEach((pos, i) => {
      const freq = fretToFreq(pos.string, pos.fret);
      synth.triggerAttack(freq, now + i * 0.18);
    });

    setTimeout(() => {
      setPlaying(false);
      synth.dispose();
      reverb.dispose();
    }, voicing.length * 180 + 1800);
  }

  return (
    <button
      onClick={play}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all
        ${playing
          ? 'bg-green-600 text-white scale-95'
          : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105'}`}
    >
      <span className="text-lg">{playing ? '♪' : '▶'}</span>
      {playing ? 'En cours…' : 'Écouter'}
    </button>
  );
}
