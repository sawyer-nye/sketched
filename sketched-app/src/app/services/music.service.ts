import { Injectable } from '@angular/core';
import { Chord } from '../enums/chord-enum';
import { Mode } from '../enums/mode-enum';
import { NoteName } from '../enums/note-name.enum';
import { Step } from '../enums/step.enum';
import { Note } from '../models/note.model';
import { notes } from './sound.data';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  octaveThreeAndFourNotes = notes.filter(
    (note) => note.octave === 3 || note.octave === 4
  );

  constructor() {}

  modesMap: Record<Mode, number[]> = {
    [Mode.IONIAN]: [0, 2, 4, 5, 7, 9, 11, 12],
    [Mode.AEOLIAN]: [0, 2, 3, 5, 7, 8, 10, 12],
    [Mode.DORIAN]: [0, 2, 3, 5, 7, 9, 10, 12],
    [Mode.PHRYGIAN]: [0, 1, 3, 5, 7, 8, 10, 12],
    [Mode.LYDIAN]: [0, 2, 4, 6, 7, 9, 11, 12],
    [Mode.MIXOLYDIAN]: [0, 2, 4, 5, 7, 9, 10, 12],
    [Mode.LOCRIAN]: [0, 1, 3, 5, 6, 8, 10, 12]
  };

  triadsMap: Record<Chord, number[]> = {
    [Chord.I]: [0, 2, 4],
    [Chord.II]: [1, 3, 5],
    [Chord.III]: [2, 4, 6],
    [Chord.IV]: [3, 5, 7],
    [Chord.V]: [4, 6, 1],
    [Chord.VI]: [5, 7, 2],
    [Chord.VII]: [6, 1, 3]
  }

  getNextStep(fromNote: Note, step: Step): Note {
    const jumpDistance = step === Step.HALF ? 1 : 2;
    return (
      notes.find(
        (note: Note) => note.position === fromNote.position + jumpDistance
      ) ?? { position: -1, name: NoteName.C, frequency: 0, octave: 0 }
    );
  }

  generateScale(rootNotePosition: number, mode: Mode): Note[] {
    const _notes = notes;

    const newNotes: Note[] = [];

    for (const step of this.modesMap[mode]) {
      const newPosition = rootNotePosition + step;
      newNotes.push(_notes[newPosition])
    }

    return newNotes;
  }

  getChord(chord: Chord, notes: Note[]): Note[] {
    const pattern = this.triadsMap[chord];
    return [notes[pattern[0]], notes[pattern[1]], notes[pattern[2]]]
  }
}
