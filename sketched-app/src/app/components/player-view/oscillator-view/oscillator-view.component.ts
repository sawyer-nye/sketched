import { Component, OnInit } from '@angular/core';
import { AudioContextService } from 'src/app/services/audio-context/audio-context.service';
import { OscillatorService } from 'src/app/services/oscillator/oscillator.service';

@Component({
  selector: 'app-oscillator-view',
  templateUrl: './oscillator-view.component.html',
  styleUrls: ['./oscillator-view.component.scss']
})
export class OscillatorViewComponent implements OnInit {
  oscillators: OscillatorNode[] = []

  constructor(private readonly ctxService: AudioContextService, private readonly oscillatorService: OscillatorService) {}

  ngOnInit(): void {
    this.oscillators = this.oscillatorService.getOscillators('sine', 3);
  }

  playOscillator(oscillator: OscillatorNode): void {
    this.oscillatorService.playOscillator(oscillator, 2);
    //oscillator.start(this.ctxService.getAudioContext().currentTime);
    //oscillator.stop(this.ctxService.getAudioContext().currentTime + 1.5);
  }
}
