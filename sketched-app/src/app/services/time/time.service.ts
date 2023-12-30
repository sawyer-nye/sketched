import { Injectable } from '@angular/core';
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
}

@Injectable({ providedIn: 'root' })
export class TimeService {
  private readonly _isMetronomeOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _isPlaying: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _bpm: BehaviorSubject<number> = new BehaviorSubject<number>(120);
  private readonly _numBeatsPerBar: BehaviorSubject<number> = new BehaviorSubject<number>(4);
  private readonly _noteDurationPerBeat: BehaviorSubject<number> = new BehaviorSubject<number>(4);
  private readonly _loopDuration: BehaviorSubject<number> = new BehaviorSubject<number>(2);

  readonly isMetronomeOn$: Observable<boolean> = this._isMetronomeOn.asObservable();
  readonly isPlaying$: Observable<boolean> = this._isPlaying.asObservable();
  readonly bpm$: Observable<number> = this._bpm.asObservable();
  readonly numBeatsPerBar$: Observable<number> = this._numBeatsPerBar.asObservable();
  readonly noteDurationPerBeat$: Observable<number> = this._noteDurationPerBeat.asObservable();
  readonly loopDuration$: Observable<number> = this._loopDuration.asObservable();

  readonly counter$: Observable<number> = combineLatest([this._isPlaying, this._bpm]).pipe(
    switchMap(([isPlaying, bpm]) => (isPlaying ? timer(0, 1000 * (60 / bpm)) : NEVER)),
    switchMap((counterVal) => (counterVal === 0 ? NEVER : of(counterVal)))
  );

  readonly counterTick$: Observable<number> = this.counter$.pipe(
    withLatestFrom(this.numBeatsPerBar$, this.noteDurationPerBeat$, this.loopDuration$),
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
    tap(console.log)
  );

  readonly metronomeClick$: Observable<MetronomeClickType> = this.counterTick$.pipe(
    withLatestFrom(this.numBeatsPerBar$, this.isMetronomeOn$),
    switchMap(([counterTick, numBeatsPerBar, isMetronomeOn]) => {
      if (isMetronomeOn) {
        return of(counterTick % numBeatsPerBar === 1 ? MetronomeClickType.TIP : MetronomeClickType.TAP);
      } else {
        return NEVER;
      }
    })
  );

  get isMetronomeOn(): boolean {
    return this._isMetronomeOn.getValue();
  }

  toggleIsMetronomeOn(): void {
    this._isMetronomeOn.next(!this.isMetronomeOn);
  }

  get isPlaying(): boolean {
    return this._isPlaying.getValue();
  }

  toggleIsPlaying(): void {
    this._isPlaying.next(!this.isPlaying);
  }

  get bpm(): number {
    return this._bpm.getValue();
  }

  setBpm(bpm: number): void {
    this._bpm.next(bpm);
  }

  get numBeatsPerBar(): number {
    return this._numBeatsPerBar.getValue();
  }

  setNumBeatsPerBar(numBeatsPerBar: number): void {
    this._numBeatsPerBar.next(numBeatsPerBar);
  }

  get noteDurationPerBeat(): number {
    return this._noteDurationPerBeat.getValue();
  }

  setNoteDurationPerBeat(noteDurationPerBeat: number) {
    this._noteDurationPerBeat.next(noteDurationPerBeat);
  }

  get loopDuration(): number {
    return this._loopDuration.getValue();
  }

  setLoopDuration(durationInMeasures: number): void {
    this._loopDuration.next(durationInMeasures);
  }
}
