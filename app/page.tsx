'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  NOTE_NAMES, DEGREE_LABELS, DEGREE_CHORD_TYPE, DEGREE_NOTE_NAMES,
  ARPEGGIO_SYMBOL, getArpeggioPositions, getChordName, HarmonyMode,
} from '@/lib/music';

const Fretboard      = dynamic(() => import('@/components/Fretboard'),      { ssr: false });
const PositionsPanel = dynamic(() => import('@/components/PositionsPanel'), { ssr: false });
const PlayButton     = dynamic(() => import('@/components/PlayButton'),     { ssr: false });
const FavoritesPanel = dynamic(() => import('@/components/FavoritesPanel'), { ssr: false });

const TYPE_BG: Record<string, string> = {
  Maj7:    'bg-amber-900/40 text-amber-300 border-amber-700',
  m7:      'bg-blue-900/40 text-blue-300 border-blue-700',
  Dom7:    'bg-red-900/40 text-red-300 border-red-700',
  m7b5:    'bg-purple-900/40 text-purple-300 border-purple-700',
  mMaj7:   'bg-teal-900/40 text-teal-300 border-teal-700',
  'Maj7#5':'bg-cyan-900/40 text-cyan-300 border-cyan-700',
  dim7:    'bg-rose-900/40 text-rose-300 border-rose-700',
};

export default function Home() {
  const [mode,        setMode]        = useState<HarmonyMode>('major');
  const [keyNote,     setKeyNote]     = useState(0);
  const [degreeIndex, setDegreeIndex] = useState(0);
  const [fretMin,     setFretMin]     = useState(0);
  const [fretMax,     setFretMax]     = useState(12);
  const [showNotes,   setShowNotes]   = useState(false);

  const chordType  = DEGREE_CHORD_TYPE[mode][degreeIndex];
  const chordName  = getChordName(keyNote, degreeIndex, mode);
  const positions  = getArpeggioPositions(keyNote, degreeIndex, fretMin, fretMax, mode);
  const noteLabels = DEGREE_NOTE_NAMES[chordType];

  return (
    <main className="min-h-screen bg-gray-900 text-white px-3 py-4">
      <div className="max-w-5xl mx-auto space-y-3">

        {/* ── Controls ── */}
        <div className="bg-gray-800 rounded-2xl p-3 sm:p-4 space-y-3">

          {/* Harmony mode — full width on mobile */}
          <div className="grid grid-cols-2 gap-2">
            {(['major', 'melodicMinor'] as HarmonyMode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setDegreeIndex(0); }}
                className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors
                  ${mode === m ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 active:bg-gray-600'}`}>
                {m === 'major' ? 'Gamme majeure' : 'Min. mélodique'}
              </button>
            ))}
          </div>

          {/* Key selector — compact on mobile */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Tonalité</label>
            <div className="flex items-center gap-1 flex-wrap">
              <button onClick={() => setKeyNote(k => (k - 1 + 12) % 12)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-700 active:bg-gray-600 text-gray-300 font-bold text-lg leading-none flex-shrink-0">
                ‹
              </button>
              <div className="flex gap-1 flex-wrap flex-1">
                {NOTE_NAMES.map((note, i) => (
                  <button key={i} onClick={() => setKeyNote(i)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-semibold transition-colors
                      ${keyNote === i ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 active:bg-gray-600'}`}>
                    {note}
                  </button>
                ))}
              </div>
              <button onClick={() => setKeyNote(k => (k + 1) % 12)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-700 active:bg-gray-600 text-gray-300 font-bold text-lg leading-none flex-shrink-0">
                ›
              </button>
            </div>
          </div>

          {/* Degree selector */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Degré</label>
            <div className="grid grid-cols-7 gap-1">
              {DEGREE_LABELS.map((deg, i) => {
                const type = DEGREE_CHORD_TYPE[mode][i];
                return (
                  <button key={i} onClick={() => setDegreeIndex(i)}
                    className={`flex flex-col items-center py-1.5 px-0.5 rounded-lg text-xs transition-colors border
                      ${degreeIndex === i ? TYPE_BG[type] : 'bg-gray-700 text-gray-300 border-transparent active:bg-gray-600'}`}>
                    <span className="font-bold text-xs sm:text-sm">{deg}</span>
                    <span className="text-[9px] sm:text-xs opacity-70 leading-tight">{ARPEGGIO_SYMBOL[type]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fret range + actions */}
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Fr. min</label>
              <input type="number" min={0} max={fretMax - 1} value={fretMin}
                onChange={e => setFretMin(Math.max(0, +e.target.value))}
                className="w-16 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Fr. max</label>
              <input type="number" min={fretMin + 1} max={24} value={fretMax}
                onChange={e => setFretMax(Math.min(24, +e.target.value))}
                className="w-16 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white" />
            </div>
            <PlayButton keyNote={keyNote} degreeIndex={degreeIndex} arpeggioType={chordType} mode={mode} />
            <button onClick={() => setShowNotes(v => !v)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors
                ${showNotes ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 active:bg-gray-600'}`}>
              {showNotes ? 'Notes' : 'Degrés'}
            </button>
          </div>
        </div>

        {/* ── Chord info ── */}
        <div className={`rounded-2xl px-4 py-3 border flex items-center justify-between gap-2 flex-wrap ${TYPE_BG[chordType]}`}>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold">{chordName}</span>
            <span className="text-sm opacity-70">{chordType}</span>
          </div>
          <div className="flex gap-2 text-xs sm:text-sm opacity-80 flex-wrap">
            {noteLabels.map((n, i) => <span key={i}>{n}</span>)}
          </div>
        </div>

        {/* ── Main fretboard ── */}
        <div className="bg-gray-800 rounded-2xl p-3 sm:p-4">
          <Fretboard
            positions={positions}
            arpeggioType={chordType}
            fretMin={fretMin}
            fretMax={fretMax}
            showNotes={showNotes}
            variant="full"
          />
        </div>

        {/* ── 5 positions 2-2-1 ── */}
        <div className="bg-gray-800 rounded-2xl p-3 sm:p-4">
          <PositionsPanel
            keyNote={keyNote}
            degreeIndex={degreeIndex}
            arpeggioType={chordType}
            mode={mode}
            showNotes={showNotes}
          />
        </div>

        {/* ── Favorites ── */}
        <FavoritesPanel
          keyNote={keyNote}
          degreeIndex={degreeIndex}
          chordName={chordName}
          onSelect={(kn, di) => { setKeyNote(kn); setDegreeIndex(di); }}
        />

      </div>
    </main>
  );
}
