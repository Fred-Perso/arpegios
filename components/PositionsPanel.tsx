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

const DEGREE_FILL  = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

function MiniBoard({
  keyNote, degreeIndex, arpeggioType, mode, showNotes, wMin, wMax, label,
}: Props & { wMin: number; wMax: number; label: string }) {
  const positions = getArpeggioPositions(keyNote, degreeIndex, wMin, wMax, mode);
  return (
    <div className="bg-gray-900 rounded-xl p-2">
      <Fretboard
        positions={positions}
        arpeggioType={arpeggioType}
        fretMin={wMin}
        fretMax={wMax}
        showNotes={showNotes}
        variant="panel"
        positionLabel={label}
      />
    </div>
  );
}

export default function PositionsPanel({ keyNote, degreeIndex, arpeggioType, mode, showNotes }: Props) {
  const rootSemitone = getRootSemitone(keyNote, degreeIndex, mode);
  const windows      = getPositionWindows(rootSemitone);
  const labels       = DEGREE_NOTE_NAMES[arpeggioType];

  const miniProps = { keyNote, degreeIndex, arpeggioType, mode, showNotes };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 uppercase tracking-wider">5 positions</p>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {labels.map((lbl, i) => (
          <span key={i} className="flex items-center gap-1 text-xs text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: DEGREE_FILL[i] }} />
            {lbl}
          </span>
        ))}
      </div>

      {/* Row 1: positions 0 + 1 */}
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map(i => windows[i] && (
          <MiniBoard key={i} {...miniProps}
            wMin={windows[i][0]} wMax={windows[i][1]}
            label={`Pos. ${i + 1}  ${windows[i][0]}–${windows[i][1]}`} />
        ))}
      </div>

      {/* Row 2: positions 2 + 3 */}
      <div className="grid grid-cols-2 gap-2">
        {[2, 3].map(i => windows[i] && (
          <MiniBoard key={i} {...miniProps}
            wMin={windows[i][0]} wMax={windows[i][1]}
            label={`Pos. ${i + 1}  ${windows[i][0]}–${windows[i][1]}`} />
        ))}
      </div>

      {/* Row 3: position 5 — full width on mobile, half on larger */}
      {windows[4] && (
        <div className="grid grid-cols-2 gap-2">
          <MiniBoard {...miniProps}
            wMin={windows[4][0]} wMax={windows[4][1]}
            label={`Pos. 5  ${windows[4][0]}–${windows[4][1]}`} />
          <div /> {/* spacer */}
        </div>
      )}
    </div>
  );
}
