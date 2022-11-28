import { Injectable } from '@angular/core';
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

  altModesMap: Record<string, Step[]> = {
    ionian: [
      Step.WHOLE,
      Step.WHOLE,
      Step.HALF,
      Step.WHOLE,
      Step.WHOLE,
      Step.WHOLE,
      Step.HALF,
    ],
    aeolian: [
      Step.WHOLE,
      Step.HALF,
      Step.WHOLE,
      Step.WHOLE,
      Step.HALF,
      Step.WHOLE,
      Step.WHOLE,
    ],
  };

  modesMap: Record<string, number[]> = {
    ionian: [0, 2, 4, 5, 7, 9, 11, 12],
    aeolian: [0, 2, 3, 5, 7, 8, 10, 12],
    // should include dorian, phrygian, lydian, mixolydian, locrian
  };

  getNextStep(fromNote: Note, step: Step): Note {
    const jumpDistance = step === Step.HALF ? 1 : 2;
    return (
      notes.find(
        (note: Note) => note.position === fromNote.position + jumpDistance
      ) ?? { position: -1, name: NoteName.C, frequency: 0, octave: 0 }
    );
  }

  generateScale(rootNotePosition: number, mode: string): Note[] {
    const _notes = notes;

    const newNotes: Note[] = [];

    for (const step of this.modesMap[mode]) {
      const rootPosition = rootNotePosition;
      const newPosition = rootNotePosition + step;
      newNotes.push(_notes[newPosition])
    }

    return newNotes;

    // for (let i = root.position; i < root.position + 12; i++) {
    //   newNotes.push(
    //     this.getNextStep(notes[i]);
    //   )
    // }
  }
}
