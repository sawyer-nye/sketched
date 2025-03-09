import { Note } from './note.model';

export interface PianoRollNote {
  note: Note;
  startTime: number; // In beats
  duration: number; // In beats
  velocity: number; // 0-1 value for note velocity/volume
}

export interface Track {
  id: string;
  name: string;
  notes: PianoRollNote[];
  instrumentId: string;
  isMuted: boolean;
  isSolo: boolean;
  volume: number; // 0-1 value
}
