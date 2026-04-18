'use client';
import { getArpeggioPositions, getPositionWindows, ArpeggioType, MAJOR_SCALE_INTERVALS } from '@/lib/music';
import Fretboard from './Fretboard';

interface Props {
  keyNote: number;
  degreeIndex: number;
  arpeggioType: ArpeggioType;
  showNotes: boolean;
}

const POSITION_NAMES = ['I', 'II', 'III', 'IV', 'V'];

export default function PositionsGrid({ keyNote, degreeIndex, arpeggioType, showNotes }: Props) {
  const rootSemitone = (keyNote + MAJOR_SCALE_INTERVALS[degreeIndex]) % 12;
  const windows = getPositionWindows(rootSemitone);

  return (
    <div className="bg-gray-800 rounded-2xl p-5">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">5 positions sur le manche</p>
      <div className="grid grid-cols-5 gap-3">
        {windows.map(([wMin, wMax], i) => {
          const positions = getArpeggioPositions(keyNote, degreeIndex, wMin, wMax + 1);
          return (
            <div key={i} className="bg-gray-900 rounded-xl p-2">
              <Fretboard
                positions={positions}
                arpeggioType={arpeggioType}
                fretMin={wMin}
                fretMax={wMax + 1}
                showNotes={showNotes}
                mini={true}
                positionLabel={`Pos. ${POSITION_NAMES[i]}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
