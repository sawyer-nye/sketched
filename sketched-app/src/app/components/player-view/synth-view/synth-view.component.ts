import { Component, OnInit } from '@angular/core';
import * as Tone from 'tone';

import { ToneService } from 'src/app/services/tone/tone.service';

@Component({
  selector: 'app-synth-view',
  templateUrl: './synth-view.component.html',
  styleUrls: ['./synth-view.component.scss']
})
export class OscillatorViewComponent implements OnInit {
  synths: Tone.PolySynth[] = []

  constructor(private readonly toneService: ToneService) {}

  ngOnInit(): void {
    this.synths = this.toneService.getSynths();
  }

  playSynth(synth: Tone.PolySynth): void {
    this.toneService.playCThree();
  }
}
