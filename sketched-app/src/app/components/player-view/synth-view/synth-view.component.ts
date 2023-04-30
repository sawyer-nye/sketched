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
  oscillatorTypes: NonCustomOscillatorType[] = [
    'sine',
    'sawtooth',
    'square',
    'triangle',
  ];
  synthSetups: SynthSetup[] = [];

  constructor(private readonly toneService: ToneService) {}

  ngOnInit(): void {
    this.synthSetups = this.toneService.getSynths();
  }

  playSynth(synth: Tone.MonoSynth): void {
    this.toneService.playSynth(synth);
  }

  changeOscillatorOctave(synth: Tone.MonoSynth, octave: string) {
    this.toneService.setOscillatorOctave(synth, octave)
  }

  changeOscillatorType(
    synth: Tone.MonoSynth,
    newType: NonCustomOscillatorType
  ) {
    this.toneService.setOscillatorType(synth, newType);
  }
}
