import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Chord } from '../enums/chord-enum';
import { Mode } from '../enums/mode-enum';
import { NoteName } from '../enums/note-name.enum';
import { Step } from '../enums/step.enum';
import { Note } from '../models/note.model';
import { notes } from './sound.data';
import { ChordType } from '../enums/chord-type.enum';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private readonly modesMap: Record<Mode, number[]> = {
    [Mode.IONIAN]: [0, 2, 4, 5, 7, 9, 11],
    [Mode.AEOLIAN]: [0, 2, 3, 5, 7, 8, 10],
    [Mode.DORIAN]: [0, 2, 3, 5, 7, 9, 10],
    [Mode.PHRYGIAN]: [0, 1, 3, 5, 7, 8, 10],
    [Mode.LYDIAN]: [0, 2, 4, 6, 7, 9, 11],
    [Mode.MIXOLYDIAN]: [0, 2, 4, 5, 7, 9, 10],
    [Mode.LOCRIAN]: [0, 1, 3, 5, 6, 8, 10],
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

  private readonly chordStepMap: Record<Chord, number> = {
    [Chord.I]: 0,
    [Chord.II]: 1,
    [Chord.III]: 2,
    [Chord.IV]: 3,
    [Chord.V]: 4,
    [Chord.VI]: 5,
    [Chord.VII]: 6,
  };

  private readonly chordPatternsMap: Record<ChordType, number[]> = {
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
    [ChordType.ADDED_ELEVENTH]: [0, 2, 4, 12],
  };

  private readonly _subscriptions: Subscription[] = [];

  private readonly _currentScale = new BehaviorSubject<Note[]>([]);
  private readonly _currentChords = new BehaviorSubject<Note[][]>([]);
  private readonly _allChords = new BehaviorSubject<Record<ChordType, Note[][]> | null>(null);

  readonly currentScale$: Observable<Note[]> = this._currentScale.asObservable();
  readonly currentChords$: Observable<Note[][]> = this._currentChords.asObservable();
  readonly allChords$: Observable<Record<ChordType, Note[][]> | null> = this._allChords.asObservable();

  readonly octaveThreeAndFourNotes = notes.filter((note) => note.octave === 3 || note.octave === 4);

  constructor() {
    this._subscriptions.push(
      this._currentScale.subscribe((currentScale) => {
        this.setChords(currentScale);
        this.setAllChords(currentScale);
      })
    );
  }

  get currentScale() {
    return this._currentScale.getValue();
  }

  get currentChords() {
    return this._currentChords.getValue();
  }

  get allChords() {
    return this._allChords.getValue();
  }

  setScale(rootNotePosition: number, mode: Mode): void {
    this._currentScale.next(this.generateScale(rootNotePosition, mode));
  }

  setChords(scaleNotes: Note[]) {
    this._currentChords.next(this.generateChords(scaleNotes));
  }

  setAllChords(scaleNotes: Note[]) {
    this._allChords.next(this.generateAllChords(scaleNotes));
  }

  getNextStep(fromNote: Note, step: Step): Note {
    const jumpDistance = step === Step.HALF ? 1 : 2;
    return (
      notes.find((note: Note) => note.position === fromNote.position + jumpDistance) ?? {
        position: -1,
        name: NoteName.C,
        frequency: 0,
        octave: 0,
      }
    );
  }

  private generateScale(rootNotePosition: number, mode: Mode): Note[] {
    const _notes = notes;

    const newNotes: Note[] = [];

    for (const step of this.modesMap[mode]) {
      const newPosition = rootNotePosition + step;
      newNotes.push(_notes[newPosition]);
    }

    for (const step of this.modesMap[mode]) {
      const newPosition = rootNotePosition + 12 + step;
      newNotes.push(_notes[newPosition]);
    }

    for (const step of this.modesMap[mode]) {
      const newPosition = rootNotePosition + 24 + step;
      newNotes.push(_notes[newPosition]);
    }

    return newNotes;
  }

  private generateAllChords(scaleNotes: Note[]): Record<ChordType, Note[][]> {
    return {
      [ChordType.FIFTH]: this.generateChords(scaleNotes, ChordType.FIFTH),
      [ChordType.TRIAD]: this.generateChords(scaleNotes, ChordType.TRIAD),
      [ChordType.SEVENTH]: this.generateChords(scaleNotes, ChordType.SEVENTH),
      [ChordType.NINTH]: this.generateChords(scaleNotes, ChordType.NINTH),
      [ChordType.ELEVENTH]: this.generateChords(scaleNotes, ChordType.ELEVENTH),
      [ChordType.THIRTEENTH]: this.generateChords(scaleNotes, ChordType.THIRTEENTH),
      [ChordType.ADDED_NINTH]: this.generateChords(scaleNotes, ChordType.ADDED_NINTH),
      [ChordType.SUS]: this.generateChords(scaleNotes, ChordType.SUS),
      [ChordType.SUS_SEVENTH]: this.generateChords(scaleNotes, ChordType.SUS_SEVENTH),
      [ChordType.SIXTH]: this.generateChords(scaleNotes, ChordType.SIXTH),
      [ChordType.SIXTH_NINTH]: this.generateChords(scaleNotes, ChordType.SIXTH_NINTH),
      [ChordType.ADDED_ELEVENTH]: this.generateChords(scaleNotes, ChordType.ADDED_ELEVENTH),
    };
  }

  private generateChords(scaleNotes: Note[], chordType: ChordType = ChordType.TRIAD): Note[][] {
    return [
      this.getChord(Chord.I, scaleNotes, chordType),
      this.getChord(Chord.II, scaleNotes, chordType),
      this.getChord(Chord.III, scaleNotes, chordType),
      this.getChord(Chord.IV, scaleNotes, chordType),
      this.getChord(Chord.V, scaleNotes, chordType),
      this.getChord(Chord.VI, scaleNotes, chordType),
      this.getChord(Chord.VII, scaleNotes, chordType),
    ];
  }

  private getChord(chord: Chord, notes: Note[], chordType: ChordType): Note[] {
    if (!notes.length) {
      return [];
    }

    const pattern = this.chordPatternsMap[chordType];
    const chordSteps = this.chordStepMap[chord];

    let result = [];
    for (const rootStep of pattern) {
      const index = (rootStep + chordSteps) % 21;
      const note = notes[index];
      result.push(note);
    }
    return result;
  }
}
