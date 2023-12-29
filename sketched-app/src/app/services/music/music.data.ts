import { Chord } from '@enums/chord-enum';
import { ChordType } from '@enums/chord-type.enum';
import { Mode } from '@enums/mode-enum';

export const modesMap: Record<Mode, number[]> = {
  [Mode.IONIAN]: [0, 2, 4, 5, 7, 9, 11],
  [Mode.AEOLIAN]: [0, 2, 3, 5, 7, 8, 10],
  [Mode.DORIAN]: [0, 2, 3, 5, 7, 9, 10],
  [Mode.PHRYGIAN]: [0, 1, 3, 5, 7, 8, 10],
  [Mode.LYDIAN]: [0, 2, 4, 6, 7, 9, 11],
  [Mode.MIXOLYDIAN]: [0, 2, 4, 5, 7, 9, 10],
  [Mode.LOCRIAN]: [0, 1, 3, 5, 6, 8, 10],
};

export const chordStepMap: Record<Chord, number> = {
  [Chord.I]: 0,
  [Chord.II]: 1,
  [Chord.III]: 2,
  [Chord.IV]: 3,
  [Chord.V]: 4,
  [Chord.VI]: 5,
  [Chord.VII]: 6,
};

export const chordPatternsMap: Record<ChordType, number[]> = {
  [ChordType.FIFTH]: [0, 4],
  [ChordType.TRIAD]: [0, 2, 4],
  [ChordType.SEVENTH]: [0, 2, 4, 6],
  [ChordType.NINTH]: [0, 2, 4, 6, 8],
  [ChordType.ELEVENTH]: [0, 2, 4, 6, 8, 10],
  [ChordType.THIRTEENTH]: [0, 2, 4, 6, 8, 10, 12],
  [ChordType.ADDED_NINTH]: [0, 2, 4, 8],
  [ChordType.SUS]: [0, 3, 4],
  [ChordType.SUS_SEVENTH]: [0, 3, 4, 6],
  [ChordType.SIXTH]: [0, 2, 4, 5],
  [ChordType.SIXTH_NINTH]: [0, 2, 4, 5, 8],
  [ChordType.ADDED_ELEVENTH]: [0, 2, 4, 10],
};
