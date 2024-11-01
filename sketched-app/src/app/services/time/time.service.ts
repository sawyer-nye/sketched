import { Injectable } from '@angular/core';
import { TimeDivision } from '@app/enums/time-division.enum';
import { getLowerTimeDivision, timeDivisionByBeatValue, timeDivisionMap } from '@app/services/time/time.data';
import {
  BehaviorSubject,
  NEVER,
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';

export enum MetronomeClickType {
  TIP = 'TIP',
  TAP = 'TAP',
  HALF_TIP = 'HALF_TIP',
  QUARTER_TIP = 'QUARTER_TIP',
}

@Injectable({ providedIn: 'root' })
export class TimeService {
  private readonly _isMetronomeOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _isPlaying: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _bpm: BehaviorSubject<number> = new BehaviorSubject<number>(120);
  private readonly _numBeatsPerBar: BehaviorSubject<number> = new BehaviorSubject<number>(4);
  private readonly _beatValue: BehaviorSubject<number> = new BehaviorSubject<number>(4);
  private readonly _loopDuration: BehaviorSubject<number> = new BehaviorSubject<number>(2);

  readonly isMetronomeOn$: Observable<boolean> = this._isMetronomeOn.asObservable();
  readonly isPlaying$: Observable<boolean> = this._isPlaying.asObservable();
  readonly bpm$: Observable<number> = this._bpm.asObservable();
  readonly numBeatsPerBar$: Observable<number> = this._numBeatsPerBar.asObservable();
  readonly beatValue$: Observable<number> = this._beatValue.asObservable();
  readonly loopDuration$: Observable<number> = this._loopDuration.asObservable();

  readonly beatCounter$: Observable<number> = combineLatest([this.isPlaying$, this.bpm$, this.beatValue$]).pipe(
    switchMap(([isPlaying, bpm, beatValue]) => {
      const baseDivision = timeDivisionByBeatValue.get(beatValue)!;
      return isPlaying ? this.buildTimer(bpm, baseDivision) : NEVER;
    }),
    switchMap((tick) => this.discardFirstTick(tick))
  );

  readonly beatTick$: Observable<number> = this.beatCounter$.pipe(
    withLatestFrom(this.numBeatsPerBar$, this.beatValue$, this.loopDuration$),
    map(([counter, numBeatsPerBar, _, loopDuration]) => {
      if (counter > numBeatsPerBar) {
        if (counter > loopDuration * numBeatsPerBar) {
          const val = counter % (loopDuration * numBeatsPerBar);

          return val === 0 ? loopDuration * numBeatsPerBar : val;
        }
        return counter;
      }
      return counter % numBeatsPerBar === 0 ? numBeatsPerBar : counter % numBeatsPerBar;
    }),
    tap((val) => console.log('beat tick: ', val))
  );

  readonly halfTick$: Observable<number> = combineLatest([
    this.isPlaying$,
    this.beatCounter$,
    this.bpm$,
    this.beatValue$,
  ]).pipe(
    switchMap(([isPlaying, _, bpm, beatValue]) => {
      const baseDivisionFactor = timeDivisionByBeatValue.get(beatValue)!;

      return isPlaying ? this.buildTimer(bpm, getLowerTimeDivision(baseDivisionFactor)) : NEVER;
    })
    // switchMap(this.discardFirstTick),
    // tap((val) => console.log('half tick: ', val))
  );

  readonly quarterTick$: Observable<number> = combineLatest([
    this.beatTick$,
    this.isPlaying$,
    this.bpm$,
    this.beatValue$,
  ]).pipe(
    // withLatestFrom(this.bpm$, this.beatValue$),
    switchMap(([_, isPlaying, bpm, beatValue]) => {
      const baseDivisionFactor = timeDivisionByBeatValue.get(beatValue)!;
      const halfTimeDivision = getLowerTimeDivision(baseDivisionFactor);
      const quarterTimeDivision = getLowerTimeDivision(halfTimeDivision);

      return isPlaying ? this.buildTimer(bpm, quarterTimeDivision) : NEVER;
    }),
    map((val) => val + 1),
    // switchMap(this.discardFirstTick),
    tap((val) => console.log('quarter tick: ', val))
  );

  // combineLatest([
  //   this.isPlaying$,
  //   // this.beatCounter$,
  //   this.bpm$,
  //   this.beatValue$,
  // ]).pipe(
  //   switchMap(([isPlaying, bpm, beatValue]) => {
  //     const baseDivisionFactor = timeDivisionByBeatValue.get(beatValue)!;
  //     const halfTimeDivision = getLowerTimeDivision(baseDivisionFactor);
  //     const quarterTimeDivision = getLowerTimeDivision(halfTimeDivision);

  //     return isPlaying ? this.buildTimer(bpm, quarterTimeDivision) : NEVER;
  //   }),
  //   // switchMap(this.discardFirstTick),
  //   tap((val) => console.log('quarter tick: ', val))
  // );

  readonly metronomeClick$: Observable<MetronomeClickType> = this.beatTick$.pipe(
    withLatestFrom(this.numBeatsPerBar$, this.isMetronomeOn$),
    switchMap(([beatTick, numBeatsPerBar, isMetronomeOn]) => {
      if (isMetronomeOn) {
        return of(beatTick % numBeatsPerBar === 1 ? MetronomeClickType.TIP : MetronomeClickType.TAP);
      } else {
        return NEVER;
      }
    })
  );

  get isMetronomeOn(): boolean {
    return this._isMetronomeOn.getValue();
  }

  get isPlaying(): boolean {
    return this._isPlaying.getValue();
  }

  get bpm(): number {
    return this._bpm.getValue();
  }

  get numBeatsPerBar(): number {
    return this._numBeatsPerBar.getValue();
  }

  get noteDurationPerBeat(): number {
    return this._beatValue.getValue();
  }

  get loopDuration(): number {
    return this._loopDuration.getValue();
  }

  toggleIsMetronomeOn(): void {
    this._isMetronomeOn.next(!this.isMetronomeOn);
  }

  toggleIsPlaying(): void {
    this._isPlaying.next(!this.isPlaying);
  }

  setBpm(bpm: number): void {
    this._bpm.next(bpm);
  }

  setNumBeatsPerBar(numBeatsPerBar: number): void {
    this._numBeatsPerBar.next(numBeatsPerBar);
  }

  setNoteDurationPerBeat(noteDurationPerBeat: number) {
    this._beatValue.next(noteDurationPerBeat);
  }

  setLoopDuration(durationInMeasures: number): void {
    this._loopDuration.next(durationInMeasures);
  }

  private buildTimer(bpm: number, timeDivision: TimeDivision = TimeDivision.QUARTER): Observable<number> {
    const baseValue = 1000 * (60 / bpm);
    const divisionFactor = timeDivisionMap[timeDivision];

    return timer(0, baseValue * divisionFactor);
  }

  private discardFirstTick(counterVal: number, _numDivisions: number = 1): Observable<number> {
    return counterVal === 0 ? NEVER : of(counterVal);
  }
}
