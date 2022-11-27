import { Injectable } from '@angular/core';
import { AudioContextService } from '../audio-context/audio-context.service';

@Injectable({
  providedIn: 'root',
})
export class OscillatorService {
  private _oscillatorType: OscillatorType = 'sine';
  private _oscillators: OscillatorNode[] = [];

  constructor(private readonly ctxService: AudioContextService) {}

  getOscillators(type: OscillatorType, voices: number = 3): OscillatorNode[] {
    if (
      !this._oscillators.length ||
      this._oscillators[0].type !== type ||
      this._oscillators.length !== voices
    ) {
      let oscillators = [];
      for (let i = 0; i < voices; i++) {
        oscillators.push(this.getNewOscillator(type));
      }

      this.setOscillators(oscillators);
    }

    return this._oscillators;
  }

  playOscillator(oscillator: OscillatorNode, duration: number): void {
    oscillator.start(this.ctxService.getAudioContext().currentTime);
    oscillator.stop(this.ctxService.getAudioContext().currentTime + duration)
  };

  getNewOscillator(type: OscillatorType): OscillatorNode {
    const oscillator = this.ctxService.getAudioContext().createOscillator();
    oscillator.connect(this.ctxService.getAudioContext().destination);
    // todo: when making new ones we need to disconnect the old ones, or need to just modify the ones in place
    oscillator.type = type;

    return oscillator;
  }

  setOscillators(oscillators: OscillatorNode[]): void {
    this._oscillators = oscillators;
  }

  setOscillatorType(type: OscillatorType): void {
    this._oscillatorType = type;
  }

  setNote(oscillator: OscillatorNode): void {}
}
