'use client';
import { useState } from 'react';
import {
  FretPosition, fretToFreq, getPositionWindows, getArpeggioPositions,
  getRootSemitone, ArpeggioType, HarmonyMode,
} from '@/lib/music';

interface Props {
  keyNote: number;
  degreeIndex: number;
  arpeggioType: ArpeggioType;
  mode: HarmonyMode;
}

export default function PlayButton({ keyNote, degreeIndex, arpeggioType, mode }: Props) {
  const [playing, setPlaying] = useState(false);

  async function play() {
    if (playing) return;
    const Tone = await import('tone');
    await Tone.start();

    const synth = new Tone.PluckSynth({ attackNoise: 1.5, dampening: 3800, resonance: 0.92 }).toDestination();
    const reverb = new Tone.Reverb({ decay: 1.8, wet: 0.25 }).toDestination();
    synth.connect(reverb);

    const rootSemitone = getRootSemitone(keyNote, degreeIndex, mode);
    const windows      = getPositionWindows(rootSemitone);
    const [wMin, wMax] = windows[0];
    const positions    = getArpeggioPositions(keyNote, degreeIndex, wMin, wMax + 2, mode);

    // One note per degree, lowest string first
    const voicing: FretPosition[] = [];
    for (let deg = 0; deg < 4; deg++) {
      const candidates = positions.filter(p => p.degreeIndex === deg);
      if (candidates.length > 0)
        voicing.push(candidates.reduce((a, b) => a.fret <= b.fret ? a : b));
    }
    voicing.sort((a, b) => a.string - b.string);

    setPlaying(true);
    const now = Tone.now();
    voicing.forEach((pos, i) => synth.triggerAttack(fretToFreq(pos.string, pos.fret), now + i * 0.18));

    setTimeout(() => {
      setPlaying(false);
      synth.dispose();
      reverb.dispose();
    }, voicing.length * 180 + 1800);
  }

  return (
    <button onClick={play}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all
        ${playing ? 'bg-green-600 text-white scale-95' : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105'}`}>
      <span className="text-base">{playing ? '♪' : '▶'}</span>
      {playing ? 'En cours…' : 'Écouter'}
    </button>
  );
}
