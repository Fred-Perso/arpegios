'use client';
import {
  FretPosition, FRET_MARKERS, DOUBLE_FRET_MARKERS,
  ArpeggioType, DEGREE_NOTE_NAMES, getNoteAt,
} from '@/lib/music';

interface Props {
  positions: FretPosition[];
  arpeggioType: ArpeggioType;
  fretMin: number;
  fretMax: number;
  showNotes?: boolean;
  variant?: 'full' | 'panel';
  positionLabel?: string;
}

const DEGREE_FILL = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];

export default function Fretboard({
  positions, arpeggioType, fretMin, fretMax,
  showNotes = false, variant = 'full', positionLabel,
}: Props) {
  const isPanel = variant === 'panel';

  const W            = isPanel ? 240 : 720;
  const H            = isPanel ? 140 : 200;
  const LEFT_MARGIN  = isPanel ? 10  : 36;
  const RIGHT_MARGIN = isPanel ? 8   : 20;
  const TOP_MARGIN   = isPanel ? 18  : 28;
  const BOT_MARGIN   = isPanel ? 18  : 28;

  const numFrets = fretMax - fretMin + 1;
  const fretW    = (W - LEFT_MARGIN - RIGHT_MARGIN) / numFrets;
  const stringH  = (H - TOP_MARGIN - BOT_MARGIN) / 5;
  const dotR     = isPanel ? 10 : 12;
  const fontSize = isPanel ? 8  : 9;

  const fretX  = (f: number) => LEFT_MARGIN + (f - fretMin + 0.5) * fretW;
  const stringY = (s: number) => TOP_MARGIN + (5 - s) * stringH;
  const labels = DEGREE_NOTE_NAMES[arpeggioType];

  return (
    <div className={isPanel ? '' : 'w-full overflow-x-auto'}>
      {positionLabel && (
        <p className="text-center text-xs text-gray-400 mb-1 font-medium">{positionLabel}</p>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={isPanel ? 'w-full' : 'w-full max-w-3xl mx-auto'}
        style={isPanel ? {} : { minWidth: 400 }}
      >
        {/* Nut */}
        {fretMin === 0 && (
          <rect x={LEFT_MARGIN} y={TOP_MARGIN} width={4}
            height={H - TOP_MARGIN - BOT_MARGIN} fill="#d4a017" />
        )}

        {/* Fret lines */}
        {Array.from({ length: numFrets + 1 }, (_, i) => (
          <line key={i}
            x1={LEFT_MARGIN + i * fretW} y1={TOP_MARGIN}
            x2={LEFT_MARGIN + i * fretW} y2={H - BOT_MARGIN}
            stroke="#4b5563" strokeWidth={1.5} />
        ))}

        {/* Fret markers */}
        {FRET_MARKERS.filter(f => f >= fretMin && f <= fretMax).map(f => {
          const cx = LEFT_MARGIN + (f - fretMin) * fretW + fretW / 2;
          const cy = H / 2;
          const r  = isPanel ? 3.5 : 5;
          return DOUBLE_FRET_MARKERS.includes(f) ? (
            <g key={f}>
              <circle cx={cx} cy={cy - stringH * 1.5} r={r} fill="#374151" />
              <circle cx={cx} cy={cy + stringH * 1.5} r={r} fill="#374151" />
            </g>
          ) : (
            <circle key={f} cx={cx} cy={cy} r={r} fill="#374151" />
          );
        })}

        {/* Fret numbers */}
        {isPanel ? (
          <>
            <text x={LEFT_MARGIN + fretW * 0.5}              y={H - 4} textAnchor="middle" fontSize={8} fill="#6b7280">{fretMin}</text>
            <text x={LEFT_MARGIN + (numFrets - 0.5) * fretW} y={H - 4} textAnchor="middle" fontSize={8} fill="#6b7280">{fretMax}</text>
          </>
        ) : (
          Array.from({ length: numFrets }, (_, i) => (
            <text key={i}
              x={LEFT_MARGIN + i * fretW + fretW / 2} y={H - 6}
              textAnchor="middle" fontSize={10} fill="#9ca3af">
              {fretMin + i}
            </text>
          ))
        )}

        {/* String names (full only) */}
        {!isPanel && Array.from({ length: 6 }, (_, s) => (
          <text key={s}
            x={LEFT_MARGIN - 10} y={stringY(s) + 4}
            textAnchor="middle" fontSize={10} fill="#6b7280">
            {STRING_NAMES[5 - s]}
          </text>
        ))}

        {/* String lines */}
        {Array.from({ length: 6 }, (_, s) => (
          <line key={s}
            x1={LEFT_MARGIN} y1={stringY(s)} x2={W - RIGHT_MARGIN} y2={stringY(s)}
            stroke="#9ca3af" strokeWidth={1 + (5 - s) * 0.35} />
        ))}

        {/* Notes */}
        {positions.map((pos, i) => {
          const cx    = fretX(pos.fret);
          const cy    = stringY(pos.string);
          const fill  = DEGREE_FILL[pos.degreeIndex];
          const label = showNotes ? getNoteAt(pos.string, pos.fret) : labels[pos.degreeIndex];
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={dotR} fill={fill} stroke="white" strokeWidth={1.5} />
              <text x={cx} y={cy + fontSize * 0.45}
                textAnchor="middle" fontSize={fontSize} fontWeight="bold" fill="white">
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend (full only) */}
      {!isPanel && (
        <div className="flex flex-wrap gap-3 justify-center mt-3 text-sm">
          {labels.map((label, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full inline-block" style={{ background: DEGREE_FILL[i] }} />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
