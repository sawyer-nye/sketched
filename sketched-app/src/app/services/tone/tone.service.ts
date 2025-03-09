import { Injectable } from '@angular/core';
import * as Tone from 'tone';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

import { Note } from '@models/note.model';
import { MetronomeClickType } from '@app/services/time/time.service';

export interface SynthSetup {
  id: number;
  octave: number;
  synth: Tone.MonoSynth;
}

export type SupportedInstrument = Tone.PolySynth | Tone.MonoSynth | Tone.Player;

@Injectable({
  providedIn: 'root',
})
export class ToneService {
  private readonly metronomePlayers: Record<MetronomeClickType, Tone.Player> = {
    [MetronomeClickType.TIP]: new Tone.Player('./assets/audio/metronome_tip.wav').toDestination(),
    [MetronomeClickType.TAP]: new Tone.Player('./assets/audio/metronome_tap.wav').toDestination(),
    [MetronomeClickType.HALF_TIP]: new Tone.Player('./assets/audio/metronome_half_tip.wav').toDestination(),
    [MetronomeClickType.QUARTER_TIP]: new Tone.Player('./assets/audio/metronome_quarter_tip.wav').toDestination(),
  };

  private readonly samples: Record<string, Tone.Player> = {
    snare: new Tone.Player('./assets/audio/clap_basic.wav').toDestination(),
  };

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

  getPolySynths(): Tone.PolySynth[] {
    return this.polySynths;
  }

  getSynthSetups(): SynthSetup[] {
    return this.synthSetups;
  }

  setOscillatorType(synth: Tone.MonoSynth, newType: NonCustomOscillatorType): void {
    this.replaceSynth(synth, this.buildMonoSynth(newType));
  }

  setOscillatorOctave(_synth: Tone.MonoSynth, _octave: string) {}

  playMetronomeClick(clickType: MetronomeClickType): void {
    this.metronomePlayers[clickType].start();
  }

  playSample(instrument: string): void {
    this.samples[instrument].start();
  }

  playMonoSynth(synth: Tone.MonoSynth) {
    const now = Tone.now();
    synth?.triggerAttackRelease('C3', '2n', now);
  }

  playNoteOld(note: Note, velocity: number = 0.8): void {
    const now = Tone.now();
    const synthOne = this.synthSetups[0].synth;
    synthOne?.triggerAttackRelease(note.frequency, '4n', now, velocity);
  }

  playNote(note: Note, velocity: number = 0.8): void {
    try {
      const now = Tone.now();

      const synthOne = this.synthSetups[0].synth;
      synthOne?.triggerAttackRelease(note.frequency, '4n', now, velocity);
      // // Use the appropriate instrument based on the octave range
      // if (note.octave <= 2) {
      //   // Lower octaves - use polySynth for better bass response
      //   this.polySynths[0]?.triggerAttackRelease(note.frequency, '8n', now, velocity);
      // } else if (note.octave === 3) {
      //   // Middle octave - use monoSynth
      //   this.synthSetups[0].synth?.triggerAttackRelease(note.frequency, '8n', now, velocity);
      // } else {
      //   // Higher octaves - use a different polySynth
      //   this.polySynths[1]?.triggerAttackRelease(note.frequency, '8n', now, velocity);
      // }
    } catch (error) {
      console.error('Error playing note:', error);

      // Fallback to polySynth if there was an error
      try {
        const now = Tone.now();
        this.polySynths[0]?.triggerAttackRelease(note.frequency, '8n', now, velocity);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  }

  playNotes(notes: Note[]): void {
    const now = Tone.now();
    const synthOne = this.polySynths[0];
    const frequencies = notes.map((note) => note.frequency);
    synthOne?.triggerAttackRelease(frequencies, '4n', now);
  }

  private replaceSynth(synth: Tone.MonoSynth, newSynth: Tone.MonoSynth): void {
    const synthIndex = this.getSynthSetups().findIndex((synthSetup) => synthSetup.synth == synth);
    this.synthSetups[synthIndex].synth.disconnect();
    this.synthSetups[synthIndex].synth = newSynth.toDestination();
  }

  private buildMonoSynth(type: NonCustomOscillatorType): Tone.MonoSynth {
    return new Tone.MonoSynth({ oscillator: { type: type } });
  }
}
