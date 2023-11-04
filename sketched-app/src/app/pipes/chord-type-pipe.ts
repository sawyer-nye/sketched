import { Pipe, PipeTransform } from '@angular/core';
import { ChordType } from '../enums/chord-type.enum';

@Pipe({ name: 'chordtype' })
export class ChordTypePipe implements PipeTransform {
  private readonly chordTypeMap: Record<ChordType, string> = {
    [ChordType.FIFTH]: 'Fifth',
    [ChordType.TRIAD]: 'Triad',
    [ChordType.SEVENTH]: 'Seventh',
    [ChordType.NINTH]: 'Ninth',
    [ChordType.ELEVENTH]: 'Eleventh',
    [ChordType.THIRTEENTH]: 'Thirteenth',
    [ChordType.ADDED_NINTH]: 'Added Ninth',
    [ChordType.SUS]: 'Suspended',
    [ChordType.SUS_SEVENTH]: 'Suspended Seventh',
    [ChordType.SIXTH]: 'Sixth',
    [ChordType.SIXTH_NINTH]: 'Sixth/Ninth',
    [ChordType.ADDED_ELEVENTH]: 'Added Eleventh',
  };

  transform(value: ChordType | string): string {
    return this.chordTypeMap[value as ChordType];
  }
}
