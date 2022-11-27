import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioContextService {
  private readonly _audioContext = new AudioContext();

  isInitialized: boolean = false;

  getAudioContext(): AudioContext {
    if (!this.isInitialized) {
      
    }

    return this._audioContext;
  }
}
