import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Chord } from '@app/enums/chord.enum';
import { Mode } from '@app/enums/mode.enum';
import { NoteName } from '@enums/note-name.enum';
import { Step } from '@enums/step.enum';
import { Note } from '@models/note.model';
import { notes } from '@services/sound.data';
import { ChordType } from '@enums/chord-type.enum';
import { chordPatternsMap, chordStepMap, modesMap } from './music.data';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private readonly _currentScaleMode = new BehaviorSubject<Mode>(Mode.IONIAN);
  private readonly _currentRootNote = new BehaviorSubject<Note>(notes.find((note) => note.position === 36)!);

  readonly currentScaleMode$: Observable<Mode> = this._currentScaleMode.asObservable();
  readonly currentRootNote$: Observable<Note> = this._currentRootNote.asObservable();

  readonly currentScale$: Observable<Note[]> = combineLatest([this.currentRootNote$, this.currentScaleMode$]).pipe(
    map(([currentRootNote, currentScaleMode]) => this.generateScale(currentRootNote.position, currentScaleMode)),
  );
  readonly currentChords$: Observable<Note[][]> = this.currentScale$.pipe(map((scale) => this.generateChords(scale)));
  readonly allChords$: Observable<Record<ChordType, Note[][]> | null> = this.currentScale$.pipe(
    map((scale) => this.generateAllChords(scale)),
  );

  readonly octaveThreeAndFourNotes = notes.filter((note) => note.octave === 3 || note.octave === 4);

  get currentScaleMode(): Mode {
    return this._currentScaleMode.getValue();
  }

  get currentRootNote(): Note {
    return this._currentRootNote.getValue();
  }

  setCurrentScaleMode(mode: Mode) {
    this._currentScaleMode.next(mode);
  }

  setCurrentRootNote(note: Note) {
    this._currentRootNote.next(note);
  }

  // currently unused
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

    for (const step of modesMap[mode]) {
      const newPosition = rootNotePosition + step;
      newNotes.push(_notes[newPosition]);
    }

    for (const step of modesMap[mode]) {
      const newPosition = rootNotePosition + 12 + step;
      newNotes.push(_notes[newPosition]);
    }

    for (const step of modesMap[mode]) {
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

    const pattern = chordPatternsMap[chordType];
    const chordSteps = chordStepMap[chord];

    const result = [];
    for (const rootStep of pattern) {
      const index = (rootStep + chordSteps) % 21;
      const note = notes[index];
      result.push(note);
    }
    return result;
  }
}
