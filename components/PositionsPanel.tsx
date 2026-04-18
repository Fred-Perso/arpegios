'use client';
import {
  getArpeggioPositions, getPositionWindows, getRootSemitone,
  ArpeggioType, HarmonyMode, DEGREE_NOTE_NAMES,
} from '@/lib/music';
import Fretboard from './Fretboard';

interface Props {
  keyNote: number;
  degreeIndex: number;
  arpeggioType: ArpeggioType;
  mode: HarmonyMode;
  showNotes: boolean;
}

const DEGREE_FILL = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

export default function PositionsPanel({ keyNote, degreeIndex, arpeggioType, mode, showNotes }: Props) {
  const rootSemitone = getRootSemitone(keyNote, degreeIndex, mode);
  const windows      = getPositionWindows(rootSemitone);
  const labels       = DEGREE_NOTE_NAMES[arpeggioType];

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400 uppercase tracking-wider text-center">5 positions</p>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {labels.map((lbl, i) => (
          <span key={i} className="flex items-center gap-1 text-xs text-gray-300">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: DEGREE_FILL[i] }} />
            {lbl}
          </span>
        ))}
      </div>

      {windows.map(([wMin, wMax], i) => {
        const positions = getArpeggioPositions(keyNote, degreeIndex, wMin, wMax, mode);
        return (
          <div key={i} className="bg-gray-900 rounded-xl p-2">
            <Fretboard
              positions={positions}
              arpeggioType={arpeggioType}
              fretMin={wMin}
              fretMax={wMax}
              showNotes={showNotes}
              variant="panel"
              positionLabel={`Pos. ${i + 1}  (${wMin === 0 ? '0' : wMin}–${wMax})`}
            />
          </div>
        );
      })}
    </div>
  );
}
