import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
  private readonly modesMap: Record<Mode, number[]> = {
    [Mode.IONIAN]: [0, 2, 4, 5, 7, 9, 11, 12],
    [Mode.AEOLIAN]: [0, 2, 3, 5, 7, 8, 10, 12],
    [Mode.DORIAN]: [0, 2, 3, 5, 7, 9, 10, 12],
    [Mode.PHRYGIAN]: [0, 1, 3, 5, 7, 8, 10, 12],
    [Mode.LYDIAN]: [0, 2, 4, 6, 7, 9, 11, 12],
    [Mode.MIXOLYDIAN]: [0, 2, 4, 5, 7, 9, 10, 12],
    [Mode.LOCRIAN]: [0, 1, 3, 5, 6, 8, 10, 12],
  };

  private readonly triadsMap: Record<Chord, number[]> = {
    [Chord.I]: [0, 2, 4],
    [Chord.II]: [1, 3, 5],
    [Chord.III]: [2, 4, 6],
    [Chord.IV]: [3, 5, 7],
    [Chord.V]: [4, 6, 1],
    [Chord.VI]: [5, 7, 2],
    [Chord.VII]: [6, 1, 3],
  };

  private readonly _subscriptions: Subscription[] = [];
  private readonly _currentScale = new BehaviorSubject<Note[]>([]);
  private readonly _currentChords = new BehaviorSubject<Note[][]>([]);

  readonly currentScale$: Observable<Note[]> = this._currentScale.asObservable();
  readonly currentChords$: Observable<Note[][]> = this._currentChords.asObservable();

  readonly octaveThreeAndFourNotes = notes.filter(
    (note) => note.octave === 3 || note.octave === 4
  );

  constructor() {
    this._subscriptions.push(
      this._currentScale.subscribe((currentScale) => {
        this.setChords(currentScale);
      })
    );
  }

  get currentScale() {
    return this._currentScale.getValue();
  }

  get currentChords() {
    return this._currentChords.getValue();
  }

  setScale(rootNotePosition: number, mode: Mode): void {
    this._currentScale.next(this.generateScale(rootNotePosition, mode));
  }

  setChords(scaleNotes: Note[]) {
    this._currentChords.next(this.generateChords(scaleNotes));
  }

  getNextStep(fromNote: Note, step: Step): Note {
    const jumpDistance = step === Step.HALF ? 1 : 2;
    return (
      notes.find(
        (note: Note) => note.position === fromNote.position + jumpDistance
      ) ?? { position: -1, name: NoteName.C, frequency: 0, octave: 0 }
    );
  }

  private generateScale(rootNotePosition: number, mode: Mode): Note[] {
    const _notes = notes;

    const newNotes: Note[] = [];

    for (const step of this.modesMap[mode]) {
      const newPosition = rootNotePosition + step;
      newNotes.push(_notes[newPosition]);
    }

    return newNotes;
  }

  private generateChords(scaleNotes: Note[]): Note[][] {
    return [
      this.getChord(Chord.I, scaleNotes),
      this.getChord(Chord.II, scaleNotes),
      this.getChord(Chord.III, scaleNotes),
      this.getChord(Chord.IV, scaleNotes),
      this.getChord(Chord.V, scaleNotes),
      this.getChord(Chord.VI, scaleNotes),
      this.getChord(Chord.VII, scaleNotes),
    ];
  }

  private getChord(chord: Chord, notes: Note[]): Note[] {
    if (!notes.length) {
      return [];
    }

    const pattern = this.triadsMap[chord];
    return [notes[pattern[0]], notes[pattern[1]], notes[pattern[2]]];
  }
}
