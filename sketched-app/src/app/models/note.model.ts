import { NoteName } from '../enums/note-name.enum';

export interface Note {
  name: NoteName,
  frequency: number,
  octave: number;
}