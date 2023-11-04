import { Component, OnInit } from '@angular/core';
import * as Tone from 'tone';

import { SynthSetup, ToneService } from 'src/app/services/tone.service';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

@Component({
  selector: 'app-synth-view',
  templateUrl: './synth-view.component.html',
  styleUrls: ['./synth-view.component.scss'],
})
export class OscillatorViewComponent implements OnInit {
  oscillatorTypes: NonCustomOscillatorType[] = ['sine', 'sawtooth', 'square', 'triangle'];
  synthSetups: SynthSetup[] = [];
  synths: Tone.PolySynth[] = [];

  constructor(private readonly toneService: ToneService) {}

  ngOnInit(): void {
    this.synths = this.toneService.getPolySynths();
    this.synthSetups = this.toneService.getSynthSetups();
  }

  playSynth(synth: Tone.MonoSynth): void {
    this.toneService.playMonoSynth(synth);
  }

  changeOscillatorOctave(synth: Tone.MonoSynth, octave: string) {
    this.toneService.setOscillatorOctave(synth, octave);
  }

  changeOscillatorType(synth: Tone.MonoSynth, newType: NonCustomOscillatorType) {
    this.toneService.setOscillatorType(synth, newType);
  }
}
