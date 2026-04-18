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

  function transpose(delta: number) {
    setKeyNote(k => (k + delta + 12) % 12);
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* ── Controls ── */}
        <div className="bg-gray-800 rounded-2xl p-5 space-y-4">

          {/* Harmony mode */}
          <div className="flex gap-2">
            {(['major', 'melodicMinor'] as HarmonyMode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setDegreeIndex(0); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors
                  ${mode === m ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                {m === 'major' ? 'Gamme majeure' : 'Min. mélodique'}
              </button>
            ))}
          </div>

          {/* Key + transpose */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Tonalité</label>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => transpose(-1)}
                className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold text-lg leading-none">
                ‹
              </button>
              {NOTE_NAMES.map((note, i) => (
                <button key={i} onClick={() => setKeyNote(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors
                    ${keyNote === i ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  {note}
                </button>
              ))}
              <button onClick={() => transpose(+1)}
                className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold text-lg leading-none">
                ›
              </button>
            </div>
          </div>

          {/* Degree */}
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Degré</label>
            <div className="flex flex-wrap gap-2">
              {DEGREE_LABELS.map((deg, i) => {
                const type = DEGREE_CHORD_TYPE[mode][i];
                return (
                  <button key={i} onClick={() => setDegreeIndex(i)}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg text-sm transition-colors border
                      ${degreeIndex === i
                        ? TYPE_BG[type]
                        : 'bg-gray-700 text-gray-300 border-transparent hover:bg-gray-600'}`}>
                    <span className="font-bold">{deg}</span>
                    <span className="text-xs opacity-70">{ARPEGGIO_SYMBOL[type]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fret range */}
          <div className="flex flex-wrap gap-4 items-end">
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

        {/* ── Chord info + actions ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className={`rounded-2xl px-5 py-4 border flex-1 min-w-0 ${TYPE_BG[chordType]}`}>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">{chordName}</span>
              <span className="text-lg opacity-70">{chordType}</span>
            </div>
            <div className="flex gap-3 mt-1 text-sm opacity-80">
              {noteLabels.map((n, i) => <span key={i}>{n}</span>)}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end shrink-0">
            <PlayButton keyNote={keyNote} degreeIndex={degreeIndex} arpeggioType={chordType} mode={mode} />
            <button onClick={() => setShowNotes(v => !v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${showNotes ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {showNotes ? 'Notes réelles' : 'Degrés'}
            </button>
          </div>
        </div>

        {/* ── Main fretboard + 5 positions ── */}
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="flex-1 bg-gray-800 rounded-2xl p-5 min-w-0">
            <Fretboard
              positions={positions}
              arpeggioType={chordType}
              fretMin={fretMin}
              fretMax={fretMax}
              showNotes={showNotes}
              variant="full"
            />
          </div>

          <div className="xl:w-64 shrink-0 bg-gray-800 rounded-2xl p-4">
            <PositionsPanel
              keyNote={keyNote}
              degreeIndex={degreeIndex}
              arpeggioType={chordType}
              mode={mode}
              showNotes={showNotes}
            />
          </div>
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
