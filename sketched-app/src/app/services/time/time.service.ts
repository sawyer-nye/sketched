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
  private readonly _isPlaying: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _bpm: BehaviorSubject<number> = new BehaviorSubject<number>(120);
  private readonly _numBeatsPerBar: BehaviorSubject<number> = new BehaviorSubject<number>(4);
  private readonly _noteDurationPerBeat: BehaviorSubject<number> = new BehaviorSubject<number>(4);

  readonly isPlaying$: Observable<boolean> = this._isPlaying.asObservable();
  readonly bpm$: Observable<number> = this._bpm.asObservable();
  readonly numBeatsPerBar$: Observable<number> = this._numBeatsPerBar.asObservable();
  readonly noteDurationPerBeat$: Observable<number> = this._noteDurationPerBeat.asObservable();

  readonly counter$: Observable<number> = combineLatest([this._isPlaying, this._bpm]).pipe(
    switchMap(([isPlaying, bpm]) => (isPlaying ? timer(0, 1000 * (60 / bpm)) : NEVER)),
    switchMap((counterVal) => (counterVal === 0 ? NEVER : of(counterVal)))
  );

  readonly counterTick$: Observable<number> = this.counter$.pipe(
    withLatestFrom(this.numBeatsPerBar$, this.noteDurationPerBeat$),
    map(([counter, numBeatsPerBar, _]) => (counter % numBeatsPerBar === 0 ? numBeatsPerBar : counter % numBeatsPerBar))
  );

  readonly metronomeClick$: Observable<MetronomeClickType> = this.counterTick$.pipe(
    map((counterTick) => (counterTick === 1 ? MetronomeClickType.TIP : MetronomeClickType.TAP))
  );

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
}
