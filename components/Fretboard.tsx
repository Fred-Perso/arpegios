'use client';
import { FretPosition, FRET_MARKERS, DOUBLE_FRET_MARKERS, ArpeggioType, DEGREE_NOTE_NAMES } from '@/lib/music';

interface Props {
  positions: FretPosition[];
  arpeggioType: ArpeggioType;
  fretMin: number;
  fretMax: number;
}

const DEGREE_FILL = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];
// orange=root, blue=3rd, green=5th, purple=7th

const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];

export default function Fretboard({ positions, arpeggioType, fretMin, fretMax }: Props) {
  const W = 720;
  const H = 200;
  const LEFT_MARGIN = 36;
  const RIGHT_MARGIN = 20;
  const TOP_MARGIN = 28;
  const BOT_MARGIN = 28;

  const numFrets = fretMax - fretMin + 1;
  const fretW = (W - LEFT_MARGIN - RIGHT_MARGIN) / numFrets;
  const stringH = (H - TOP_MARGIN - BOT_MARGIN) / 5;

  const fretX = (fret: number) => LEFT_MARGIN + (fret - fretMin + 0.5) * fretW;
  const stringY = (s: number) => TOP_MARGIN + (5 - s) * stringH;

  const noteLabels = DEGREE_NOTE_NAMES[arpeggioType];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-3xl mx-auto"
        style={{ minWidth: 400 }}
      >
        {/* Nut if fretMin === 0 */}
        {fretMin === 0 && (
          <rect x={LEFT_MARGIN} y={TOP_MARGIN} width={4} height={H - TOP_MARGIN - BOT_MARGIN}
            fill="#d4a017" />
        )}

        {/* Fret lines */}
        {Array.from({ length: numFrets + 1 }, (_, i) => {
          const x = LEFT_MARGIN + i * fretW;
          return (
            <line key={i} x1={x} y1={TOP_MARGIN} x2={x} y2={H - BOT_MARGIN}
              stroke="#6b7280" strokeWidth={i === 0 ? 1 : 1.5} />
          );
        })}

        {/* Fret markers */}
        {FRET_MARKERS.filter(f => f >= fretMin && f <= fretMax).map(f => {
          const cx = LEFT_MARGIN + (f - fretMin) * fretW + fretW / 2;
          const cy = H / 2;
          return DOUBLE_FRET_MARKERS.includes(f) ? (
            <g key={f}>
              <circle cx={cx} cy={cy - stringH * 1.5} r={5} fill="#d1d5db" />
              <circle cx={cx} cy={cy + stringH * 1.5} r={5} fill="#d1d5db" />
            </g>
          ) : (
            <circle key={f} cx={cx} cy={cy} r={5} fill="#d1d5db" />
          );
        })}

        {/* Fret numbers */}
        {Array.from({ length: numFrets }, (_, i) => {
          const fret = fretMin + i;
          const cx = LEFT_MARGIN + i * fretW + fretW / 2;
          return (
            <text key={fret} x={cx} y={H - 6} textAnchor="middle"
              fontSize={10} fill="#9ca3af">
              {fret}
            </text>
          );
        })}

        {/* String lines */}
        {Array.from({ length: 6 }, (_, s) => {
          const y = stringY(s);
          const thickness = 1 + (5 - s) * 0.35;
          return (
            <line key={s} x1={LEFT_MARGIN} y1={y} x2={W - RIGHT_MARGIN} y2={y}
              stroke="#9ca3af" strokeWidth={thickness} />
          );
        })}

        {/* String names */}
        {Array.from({ length: 6 }, (_, s) => (
          <text key={s} x={LEFT_MARGIN - 10} y={stringY(s) + 4}
            textAnchor="middle" fontSize={10} fill="#6b7280">
            {STRING_NAMES[5 - s]}
          </text>
        ))}

        {/* Arpeggio notes */}
        {positions.map((pos, i) => {
          const cx = fretX(pos.fret);
          const cy = stringY(pos.string);
          const fill = DEGREE_FILL[pos.degreeIndex];
          const label = noteLabels[pos.degreeIndex];
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={12} fill={fill} stroke="white" strokeWidth={1.5} />
              <text x={cx} y={cy + 4} textAnchor="middle"
                fontSize={9} fontWeight="bold" fill="white">
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-3 text-sm">
        {noteLabels.map((label, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: DEGREE_FILL[i] }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
