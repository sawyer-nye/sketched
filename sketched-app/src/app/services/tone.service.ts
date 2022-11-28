import { Injectable } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root',
})
export class ToneService {
  private synths: Tone.PolySynth[] = [
    new Tone.PolySynth(Tone.Synth).toDestination(),
    new Tone.PolySynth(Tone.Synth).toDestination(),
    new Tone.PolySynth(Tone.Synth).toDestination(),
  ];

  constructor() {}

  getSynths(): Tone.PolySynth[] {
    return this.synths;
  }

  playCThree(): void {
    const now = Tone.now();
    const synthOne = this.synths[0];
    synthOne?.triggerAttackRelease('C3', '2n', now);
  }

  playNote(note: Note): void {
    const now = Tone.now();
    const synthOne = this.synths[0];
    synthOne?.triggerAttackRelease(note.frequency, '4n', now);
  }

  playNotes(notes: Note[]): void {
    const now = Tone.now();
    const synthOne = this.synths[0];
    const frequencies = notes.map(note => note.frequency);
    synthOne?.triggerAttackRelease(frequencies, '4n', now)
  }
}
