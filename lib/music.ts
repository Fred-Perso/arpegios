export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Open string notes in semitones (C=0): E A D G B E
export const STRING_OPEN = [4, 9, 14, 19, 23, 28];
export const STRING_OPEN_FREQ = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];

export type HarmonyMode = 'major' | 'melodicMinor';

export const SCALE_INTERVALS: Record<HarmonyMode, number[]> = {
  major:        [0, 2, 4, 5, 7, 9, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
};

export type ArpeggioType = 'Maj7' | 'm7' | 'Dom7' | 'm7b5' | 'mMaj7' | 'Maj7#5' | 'dim7';

export const ARPEGGIO_INTERVALS: Record<ArpeggioType, number[]> = {
  Maj7:    [0, 4, 7, 11],
  m7:      [0, 3, 7, 10],
  Dom7:    [0, 4, 7, 10],
  m7b5:    [0, 3, 6, 10],
  mMaj7:   [0, 3, 7, 11],
  'Maj7#5':[0, 4, 8, 11],
  dim7:    [0, 3, 6, 9],
};

export const ARPEGGIO_SYMBOL: Record<ArpeggioType, string> = {
  Maj7:    '△7',
  m7:      'm7',
  Dom7:    '7',
  m7b5:    'ø7',
  mMaj7:   'm△7',
  'Maj7#5':'△7#5',
  dim7:    'o7',
};

export const DEGREE_CHORD_TYPE: Record<HarmonyMode, ArpeggioType[]> = {
  major:        ['Maj7',  'm7',     'm7',      'Maj7',  'Dom7',  'm7',   'm7b5'],
  melodicMinor: ['mMaj7', 'm7',     'Maj7#5',  'Dom7',  'Dom7',  'm7b5', 'dim7'],
};

export const DEGREE_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export const DEGREE_NOTE_NAMES: Record<ArpeggioType, string[]> = {
  Maj7:    ['R', '3',  '5',  '△7'],
  m7:      ['R', 'b3', '5',  'b7'],
  Dom7:    ['R', '3',  '5',  'b7'],
  m7b5:    ['R', 'b3', 'b5', 'b7'],
  mMaj7:   ['R', 'b3', '5',  '△7'],
  'Maj7#5':['R', '3',  '#5', '△7'],
  dim7:    ['R', 'b3', 'b5', 'bb7'],
};

export type DegreeIndex = 0 | 1 | 2 | 3;

export interface FretPosition {
  string: number;  // 0 = low E
  fret: number;
  degreeIndex: DegreeIndex;
}

export function getArpeggioPositions(
  keyNote: number,
  degreeIndex: number,
  fretMin: number,
  fretMax: number,
  mode: HarmonyMode = 'major',
): FretPosition[] {
  const chordType = DEGREE_CHORD_TYPE[mode][degreeIndex];
  const rootSemitone = (keyNote + SCALE_INTERVALS[mode][degreeIndex]) % 12;
  const chordNotes = ARPEGGIO_INTERVALS[chordType].map(i => (rootSemitone + i) % 12);

  const positions: FretPosition[] = [];
  for (let s = 0; s < 6; s++) {
    for (let f = fretMin; f <= fretMax; f++) {
      const idx = chordNotes.indexOf((STRING_OPEN[s] + f) % 12);
      if (idx !== -1) positions.push({ string: s, fret: f, degreeIndex: idx as DegreeIndex });
    }
  }
  return positions;
}

export function getChordName(keyNote: number, degreeIndex: number, mode: HarmonyMode = 'major'): string {
  const root = (keyNote + SCALE_INTERVALS[mode][degreeIndex]) % 12;
  const type = DEGREE_CHORD_TYPE[mode][degreeIndex];
  return `${NOTE_NAMES[root]}${ARPEGGIO_SYMBOL[type]}`;
}

export function getRootSemitone(keyNote: number, degreeIndex: number, mode: HarmonyMode): number {
  return (keyNote + SCALE_INTERVALS[mode][degreeIndex]) % 12;
}

export function getPositionWindows(rootSemitone: number): [number, number][] {
  const roots = new Set<number>();
  for (const open of STRING_OPEN) {
    roots.add((rootSemitone - (open % 12) + 12) % 12);
  }
  return [...roots].sort((a, b) => a - b).map(f => {
    const min = Math.max(0, f - 1);
    return [min, min + 4] as [number, number];
  });
}

export function fretToFreq(string: number, fret: number): number {
  return STRING_OPEN_FREQ[string] * Math.pow(2, fret / 12);
}

export function getNoteAt(string: number, fret: number): string {
  return NOTE_NAMES[(STRING_OPEN[string] + fret) % 12];
}

export const FRET_MARKERS        = [3, 5, 7, 9, 12];
export const DOUBLE_FRET_MARKERS = [12];
