import { Pipe, PipeTransform } from '@angular/core';
import { NoteName } from '../enums/note-name.enum';
import { Note } from '../models/note.model';

@Pipe({ name: 'note' })
export class NotePipe implements PipeTransform {
  private readonly nameMap: Record<NoteName, string> = {
    [NoteName.A]: 'A',
    [NoteName.A_SHARP]: 'A♯',
    [NoteName.B]: 'B',
    [NoteName.C]: 'C',
    [NoteName.C_SHARP]: 'C♯',
    [NoteName.D]: 'D',
    [NoteName.D_SHARP]: 'D♯',
    [NoteName.E]: 'E',
    [NoteName.F]: 'F',
    [NoteName.F_SHARP]: 'F♯',
    [NoteName.G]: 'G',
    [NoteName.G_SHARP]: 'G♯',
  };

  transform(value: Note, octave?: number): string {
    return this.nameMap[value.name] + (octave?.toString() ?? '');
  }
}
