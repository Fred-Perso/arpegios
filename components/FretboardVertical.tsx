'use client';
import {
  FretPosition, FRET_MARKERS, DOUBLE_FRET_MARKERS,
  ArpeggioType, DEGREE_NOTE_NAMES, getNoteAt,
} from '@/lib/music';

interface Props {
  positions: FretPosition[];
  arpeggioType: ArpeggioType;
  fretMin?: number;
  fretMax?: number;
  showNotes?: boolean;
}

const DEGREE_FILL   = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];
// Low E on left, high e on right (standard portrait orientation)
const STRING_NAMES  = ['E', 'A', 'D', 'G', 'B', 'e'];

export default function FretboardVertical({
  positions, arpeggioType, fretMin = 0, fretMax = 12, showNotes = false,
}: Props) {
  const TOP_PAD    = 30;   // space for string names
  const BOT_PAD    = 14;
  const LEFT_PAD   = 28;   // space for fret numbers
  const RIGHT_PAD  = 10;

  const NUM_STRINGS = 6;
  const numFrets    = fretMax - fretMin;

  // Column per string, row per fret
  const W = 200;
  const H = 460;

  const innerW = W - LEFT_PAD - RIGHT_PAD;
  const innerH = H - TOP_PAD - BOT_PAD;

  const stringX  = (s: number) => LEFT_PAD + (s / (NUM_STRINGS - 1)) * innerW;
  const fretY    = (f: number) => TOP_PAD + ((f - fretMin) / numFrets) * innerH;

  const labels = DEGREE_NOTE_NAMES[arpeggioType];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" style={{ maxWidth: 200 }}>

      {/* String names at top */}
      {Array.from({ length: 6 }, (_, s) => (
        <text key={s} x={stringX(s)} y={18}
          textAnchor="middle" fontSize={10} fill="#9ca3af" fontWeight="bold">
          {STRING_NAMES[s]}
        </text>
      ))}

      {/* Nut (thicker line at top if fretMin === 0) */}
      {fretMin === 0 && (
        <rect x={LEFT_PAD - 2} y={TOP_PAD - 3} width={innerW + 4} height={5} rx={2} fill="#d4a017" />
      )}

      {/* Fret lines (horizontal) */}
      {Array.from({ length: numFrets + 1 }, (_, i) => {
        const fret = fretMin + i;
        const y    = fretY(fret);
        return (
          <line key={fret}
            x1={LEFT_PAD} y1={y} x2={W - RIGHT_PAD} y2={y}
            stroke="#4b5563" strokeWidth={fret === fretMin && fretMin > 0 ? 1 : 1.5} />
        );
      })}

      {/* Fret numbers (left side) */}
      {Array.from({ length: numFrets }, (_, i) => {
        const fret = fretMin + i + 1;
        const y    = fretY(fret - 0.5);
        if (!FRET_MARKERS.includes(fret)) return null;
        return (
          <text key={fret} x={LEFT_PAD - 6} y={y + 4}
            textAnchor="end" fontSize={9} fill="#6b7280">{fret}</text>
        );
      })}

      {/* Fret position dots (between fret lines, centered) */}
      {FRET_MARKERS.filter(f => f > fretMin && f <= fretMax).map(f => {
        const y  = (fretY(f) + fretY(f - 1)) / 2;
        const cx = LEFT_PAD + innerW / 2;
        return DOUBLE_FRET_MARKERS.includes(f) ? (
          <g key={f}>
            <circle cx={stringX(1)} cy={y} r={4} fill="#374151" />
            <circle cx={stringX(4)} cy={y} r={4} fill="#374151" />
          </g>
        ) : (
          <circle key={f} cx={cx} cy={y} r={4} fill="#374151" />
        );
      })}

      {/* String lines (vertical) */}
      {Array.from({ length: 6 }, (_, s) => {
        const x = stringX(s);
        // Low E (0) thickest, high e (5) thinnest
        const thickness = 1 + (5 - s) * 0.3;
        return (
          <line key={s}
            x1={x} y1={TOP_PAD} x2={x} y2={H - BOT_PAD}
            stroke="#9ca3af" strokeWidth={thickness} />
        );
      })}

      {/* Notes */}
      {positions.map((pos, i) => {
        const cx    = stringX(pos.string);
        const cy    = (fretY(pos.fret) + fretY(pos.fret - 1)) / 2;
        const fill  = DEGREE_FILL[pos.degreeIndex];
        const label = showNotes ? getNoteAt(pos.string, pos.fret) : labels[pos.degreeIndex];
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={11} fill={fill} stroke="white" strokeWidth={1.5} />
            <text x={cx} y={cy + 4}
              textAnchor="middle" fontSize={8} fontWeight="bold" fill="white">
              {label}
            </text>
          </g>
        );
      })}

      {/* Open string notes (fret 0 shown as open circles at top) */}
      {positions.filter(p => p.fret === 0).map((pos, i) => {
        const cx   = stringX(pos.string);
        const fill = DEGREE_FILL[pos.degreeIndex];
        return (
          <circle key={`open-${i}`}
            cx={cx} cy={TOP_PAD - 10} r={7}
            fill="none" stroke={fill} strokeWidth={2.5} />
        );
      })}
    </svg>
  );
}
