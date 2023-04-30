import { Injectable } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import * as Tone from 'tone';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

export interface SynthSetup {
  id: number;
  octave: number;
  synth: Tone.MonoSynth;
}

@Injectable({
  providedIn: 'root',
})
export class ToneService {
  private synthSetups: SynthSetup[] = [
    {
      id: 1,
      octave: 3,
      synth: new Tone.MonoSynth({
        oscillator: { type: 'sine' },
      }).toDestination(),
    },
    {
      id: 2,
      octave: 3,
      synth: new Tone.MonoSynth({
        oscillator: { type: 'sine' },
      }).toDestination(),
    },
    {
      id: 3,
      octave: 3,
      synth: new Tone.MonoSynth({
        oscillator: { type: 'sine' },
      }).toDestination(),
    },
  ];

  constructor() {}

  getSynths(): SynthSetup[] {
    return this.synthSetups;
  }

  setOscillatorType(
    synth: Tone.MonoSynth,
    newType: NonCustomOscillatorType
  ): void {
    this.replaceSynth(synth, this.buildMonoSynth(newType));
  }

  setOscillatorOctave(synth: Tone.MonoSynth, octave: string) {}

  playSynth(synth: Tone.MonoSynth) {
    const now = Tone.now();
    synth?.triggerAttackRelease('C4', '2n', now);
  }

  playCThree(): void {
    const now = Tone.now();
    const synthOne = this.synthSetups[0].synth;
    synthOne?.triggerAttackRelease('C3', '2n', now);
  }

  playNote(note: Note): void {
    const now = Tone.now();
    const synthOne = this.synthSetups[0].synth;
    synthOne?.triggerAttackRelease(note.frequency, '4n', now);
  }

  playNotes(notes: Note[]): void {
    const now = Tone.now();
    const synthOne = this.synthSetups[0].synth;
    const frequencies = notes.map((note) => note.frequency);
    // synthOne?.triggerAttackRelease(frequencies, '4n', now);
  }

  /* ONLY THE FIRST SYNTH IS CHANGING FOR SOME REASON */

  private replaceSynth(synth: Tone.MonoSynth, newSynth: Tone.MonoSynth): void {
    let synthIndex = this.getSynths().findIndex(
      (setup) => (setup.synth = synth)
    );
    debugger;
    this.synthSetups[synthIndex].synth.disconnect();
    this.synthSetups[synthIndex].synth = newSynth.toDestination();
  }

  private buildMonoSynth(type: NonCustomOscillatorType): Tone.MonoSynth {
    return new Tone.MonoSynth({ oscillator: { type: type } });
  }
}
