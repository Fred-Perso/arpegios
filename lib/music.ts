export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Open string notes in semitones (C=0): E A D G B E
export const STRING_OPEN = [4, 9, 14, 19, 23, 28];

export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

export type ArpeggioType = 'Maj7' | 'm7' | 'Dom7' | 'm7b5';

export const ARPEGGIO_INTERVALS: Record<ArpeggioType, number[]> = {
  Maj7:  [0, 4, 7, 11],
  m7:    [0, 3, 7, 10],
  Dom7:  [0, 4, 7, 10],
  m7b5:  [0, 3, 6, 10],
};

export const DEGREE_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// Chord type for each degree of major scale
export const DEGREE_CHORD_TYPE: ArpeggioType[] = [
  'Maj7', 'm7', 'm7', 'Maj7', 'Dom7', 'm7', 'm7b5',
];

export const DEGREE_COLORS = ['1', '3', '5', '7'] as const;
export type DegreeIndex = 0 | 1 | 2 | 3;

export const DEGREE_NOTE_NAMES: Record<ArpeggioType, string[]> = {
  Maj7:  ['R', '3', '5', '△7'],
  m7:    ['R', 'b3', '5', 'b7'],
  Dom7:  ['R', '3', '5', 'b7'],
  m7b5:  ['R', 'b3', 'b5', 'b7'],
};

export interface FretPosition {
  string: number;   // 0 = low E, 5 = high E
  fret: number;
  degreeIndex: DegreeIndex;
}

export function getArpeggioPositions(
  keyNote: number,       // 0-11, C=0
  degreeIndex: number,   // 0-6
  fretMin: number,
  fretMax: number,
): FretPosition[] {
  const chordType = DEGREE_CHORD_TYPE[degreeIndex];
  const rootSemitone = (keyNote + MAJOR_SCALE_INTERVALS[degreeIndex]) % 12;
  const intervals = ARPEGGIO_INTERVALS[chordType];
  const chordNotes = intervals.map(i => (rootSemitone + i) % 12);

  const positions: FretPosition[] = [];

  for (let s = 0; s < 6; s++) {
    for (let f = fretMin; f <= fretMax; f++) {
      const noteSemitone = (STRING_OPEN[s] + f) % 12;
      const idx = chordNotes.indexOf(noteSemitone);
      if (idx !== -1) {
        positions.push({ string: s, fret: f, degreeIndex: idx as DegreeIndex });
      }
    }
  }

  return positions;
}

export function getChordName(keyNote: number, degreeIndex: number): string {
  const root = (keyNote + MAJOR_SCALE_INTERVALS[degreeIndex]) % 12;
  const type = DEGREE_CHORD_TYPE[degreeIndex];
  const symbols: Record<ArpeggioType, string> = {
    Maj7: '△7',
    m7:   'm7',
    Dom7: '7',
    m7b5: 'ø7',
  };
  return `${NOTE_NAMES[root]}${symbols[type]}`;
}

export const FRET_MARKERS = [3, 5, 7, 9, 12];
export const DOUBLE_FRET_MARKERS = [12];

// Open string frequencies Hz: E2 A2 D3 G3 B3 E4
export const STRING_OPEN_FREQ = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];

export function fretToFreq(string: number, fret: number): number {
  return STRING_OPEN_FREQ[string] * Math.pow(2, fret / 12);
}

export function getNoteAt(string: number, fret: number): string {
  return NOTE_NAMES[(STRING_OPEN[string] + fret) % 12];
}

// Returns 5 [fretMin, fretMax] windows based on root positions across the neck
export function getPositionWindows(rootSemitone: number): [number, number][] {
  const roots = new Set<number>();
  for (const open of STRING_OPEN) {
    const fret = (rootSemitone - (open % 12) + 12) % 12;
    roots.add(fret);
  }
  const sorted = [...roots].sort((a, b) => a - b);
  return sorted.map(f => [Math.max(0, f - 1), f + 4] as [number, number]);
}
