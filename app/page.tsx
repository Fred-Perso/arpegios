'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  NOTE_NAMES, DEGREE_LABELS, DEGREE_CHORD_TYPE, DEGREE_NOTE_NAMES,
  getArpeggioPositions, getChordName,
} from '@/lib/music';

const Fretboard = dynamic(() => import('@/components/Fretboard'), { ssr: false });
const FavoritesPanel = dynamic(() => import('@/components/FavoritesPanel'), { ssr: false });

const SYMBOLS: Record<string, string> = { Maj7: '△7', m7: 'm7', Dom7: '7', m7b5: 'ø7' };
const TYPE_BG: Record<string, string> = {
  Maj7: 'bg-amber-900/40 text-amber-300 border-amber-700',
  m7:   'bg-blue-900/40 text-blue-300 border-blue-700',
  Dom7: 'bg-red-900/40 text-red-300 border-red-700',
  m7b5: 'bg-purple-900/40 text-purple-300 border-purple-700',
};

export default function Home() {
  const [keyNote, setKeyNote] = useState(0);
  const [degreeIndex, setDegreeIndex] = useState(0);
  const [fretMin, setFretMin] = useState(0);
  const [fretMax, setFretMax] = useState(12);

  const chordType = DEGREE_CHORD_TYPE[degreeIndex];
  const chordName = getChordName(keyNote, degreeIndex);
  const positions = getArpeggioPositions(keyNote, degreeIndex, fretMin, fretMax);
  const noteLabels = DEGREE_NOTE_NAMES[chordType];

  function handleSelect(kn: number, di: number) {
    setKeyNote(kn);
    setDegreeIndex(di);
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-white">Arpèges Jazz</h1>
          <p className="text-gray-400 mt-1">Harmonie majeure — arpèges à 4 sons</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5 space-y-5">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Tonalité</label>
            <div className="flex flex-wrap gap-2">
              {NOTE_NAMES.map((note, i) => (
                <button key={i} onClick={() => setKeyNote(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors
                    ${keyNote === i ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  {note}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Degré</label>
            <div className="flex flex-wrap gap-2">
              {DEGREE_LABELS.map((deg, i) => {
                const type = DEGREE_CHORD_TYPE[i];
                return (
                  <button key={i} onClick={() => setDegreeIndex(i)}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg text-sm transition-colors border
                      ${degreeIndex === i
                        ? TYPE_BG[type] + ' border-opacity-100'
                        : 'bg-gray-700 text-gray-300 border-transparent hover:bg-gray-600'}`}>
                    <span className="font-bold">{deg}</span>
                    <span className="text-xs opacity-70">{SYMBOLS[type]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Frette min</label>
              <input type="number" min={0} max={fretMax - 1} value={fretMin}
                onChange={e => setFretMin(Math.max(0, +e.target.value))}
                className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Frette max</label>
              <input type="number" min={fretMin + 1} max={24} value={fretMax}
                onChange={e => setFretMax(Math.min(24, +e.target.value))}
                className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white" />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-5 border ${TYPE_BG[chordType]}`}>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold">{chordName}</span>
            <span className="text-lg opacity-70">{chordType}</span>
          </div>
          <div className="flex gap-3 mt-2 text-sm opacity-80">
            {noteLabels.map((n, i) => <span key={i}>{n}</span>)}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5">
          <Fretboard
            positions={positions}
            arpeggioType={chordType}
            fretMin={fretMin}
            fretMax={fretMax}
          />
        </div>

        <FavoritesPanel
          keyNote={keyNote}
          degreeIndex={degreeIndex}
          chordName={chordName}
          onSelect={handleSelect}
        />

      </div>
    </main>
  );
}
