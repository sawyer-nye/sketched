import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'degree' })
export class DegreePipe implements PipeTransform {
  private readonly degreeMap: Record<number, string> = {
    0: 'I',
    1: 'II',
    2: 'III',
    3: 'IV',
    4: 'V',
    5: 'VI',
    6: 'VII',
  };

  transform(value: number): string {
    return this.degreeMap[value];
  }
}
