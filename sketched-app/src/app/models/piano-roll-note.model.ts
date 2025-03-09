import { Note } from './note.model';

export interface PianoRollNote {
  note: Note;
  startTime: number; // In beats
  duration: number; // In beats
  velocity: number; // 0-1 value for note velocity/volume
}

export enum InstrumentType {
  MONO_SYNTH = 'mono_synth',
  POLY_SYNTH = 'poly_synth',
  MONO_SAMPLE = 'mono_sample',
  POLY_SAMPLE = 'poly_sample',
}

export interface Track {
  id: string;
  name: string;
  notes: PianoRollNote[];
  instrumentType: InstrumentType;
  isMuted: boolean;
  isSolo: boolean;
  volume: number; // 0-1 value
}
