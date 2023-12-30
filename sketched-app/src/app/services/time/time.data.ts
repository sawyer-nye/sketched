import { TimeDivision } from '@app/enums/time-division.enum';

export const timeDivisionByBeatValue = new Map<number, TimeDivision>([
  [1, TimeDivision.WHOLE],
  [2, TimeDivision.HALF],
  [4, TimeDivision.QUARTER],
  [8, TimeDivision.EIGHTH],
  [16, TimeDivision.SIXTEENTH],
]);

export const timeDivisionMap: Record<TimeDivision, number> = {
  [TimeDivision.WHOLE]: 4,
  [TimeDivision.HALF]: 2,
  [TimeDivision.QUARTER]: 1,
  [TimeDivision.EIGHTH]: 0.5,
  [TimeDivision.SIXTEENTH]: 0.25,
};

export const getLowerTimeDivision = (timeDivision: TimeDivision): TimeDivision =>
  ({
    [TimeDivision.WHOLE]: TimeDivision.HALF,
    [TimeDivision.HALF]: TimeDivision.QUARTER,
    [TimeDivision.QUARTER]: TimeDivision.EIGHTH,
    [TimeDivision.EIGHTH]: TimeDivision.SIXTEENTH,
    [TimeDivision.SIXTEENTH]: TimeDivision.SIXTEENTH,
  }[timeDivision]);

export const getHigherTimeDivision = (timeDivision: TimeDivision): TimeDivision =>
  ({
    [TimeDivision.WHOLE]: TimeDivision.WHOLE,
    [TimeDivision.HALF]: TimeDivision.WHOLE,
    [TimeDivision.QUARTER]: TimeDivision.HALF,
    [TimeDivision.EIGHTH]: TimeDivision.QUARTER,
    [TimeDivision.SIXTEENTH]: TimeDivision.EIGHTH,
  }[timeDivision]);
