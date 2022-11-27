import { Injectable } from '@angular/core';

import { AudioContext } from 'standardized-audio-context';

import { Note } from 'src/app/models/note.model';
import { OscillatorService } from '../oscillator/oscillator.service';
import { notes } from './sound.data';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext = new AudioContext();
  private strikeLength: number = 2;
  private oscillators: OscillatorNode[] = [];

  constructor(private readonly oscillatorService: OscillatorService) {}

  init(): void {
    this.oscillators = this.oscillatorService.getOscillators('sine', 3);
  }

  playNote(note: Note): void {
    const oscillatorOne = this.oscillators[0];
    oscillatorOne.frequency.value = note.frequency;

    this.oscillatorService.playOscillator(oscillatorOne, this.strikeLength);
  }

  // getSemitone(note: Note, steps: number = 1): Note {
  //   if (note.octave === 8 && steps >= 1 && note.name === NoteName.B) {
  //     return note
  //   }
  //   if (note.octave === 0 && steps <= 0 && note.name === NoteName.C) {
  //     return note
  //   }
  // }
}
