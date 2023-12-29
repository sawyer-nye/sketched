import { Injectable } from '@angular/core';
import * as Tone from 'tone';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

import { Note } from '@app/models/note.model';

export interface SynthSetup {
  id: number;
  octave: number;
  synth: Tone.MonoSynth;
}

@Injectable({
  providedIn: 'root',
})
export class ToneService {
  private polySynths: Tone.PolySynth[] = [
    new Tone.PolySynth(Tone.Synth).toDestination(),
    new Tone.PolySynth(Tone.Synth).toDestination(),
    new Tone.PolySynth(Tone.Synth).toDestination(),
  ];

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

  getPolySynths(): Tone.PolySynth[] {
    return this.polySynths;
  }

  getSynthSetups(): SynthSetup[] {
    return this.synthSetups;
  }

  setOscillatorType(synth: Tone.MonoSynth, newType: NonCustomOscillatorType): void {
    this.replaceSynth(synth, this.buildMonoSynth(newType));
  }

  setOscillatorOctave(synth: Tone.MonoSynth, octave: string) {}

  playMonoSynth(synth: Tone.MonoSynth) {
    const now = Tone.now();
    synth?.triggerAttackRelease('C3', '2n', now);
  }

  playNote(note: Note): void {
    const now = Tone.now();
    const synthOne = this.synthSetups[0].synth;
    synthOne?.triggerAttackRelease(note.frequency, '4n', now);
  }

  playNotes(notes: Note[]): void {
    const now = Tone.now();
    const synthOne = this.polySynths[0];
    const frequencies = notes.map((note) => note.frequency);
    synthOne?.triggerAttackRelease(frequencies, '4n', now);
  }

  private replaceSynth(synth: Tone.MonoSynth, newSynth: Tone.MonoSynth): void {
    let synthIndex = this.getSynthSetups().findIndex((synthSetup) => synthSetup.synth == synth);
    this.synthSetups[synthIndex].synth.disconnect();
    this.synthSetups[synthIndex].synth = newSynth.toDestination();
  }

  private buildMonoSynth(type: NonCustomOscillatorType): Tone.MonoSynth {
    return new Tone.MonoSynth({ oscillator: { type: type } });
  }
}
