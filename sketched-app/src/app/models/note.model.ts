import { NoteName } from '@app/enums/note-name.enum';

export interface Note {
  position: number;
  name: NoteName;
  frequency: number;
  octave: number;
}
