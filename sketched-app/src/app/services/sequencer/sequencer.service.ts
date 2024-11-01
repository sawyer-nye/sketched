import { Injectable } from '@angular/core';
import { TimeService } from '@app/services/time/time.service';
import { NEVER, Observable, ReplaySubject, Subscription, map, of, switchMap } from 'rxjs';

export enum TickType {
  WHOLE = 'WHOLE',
  HALF = 'HALF',
  QUARTER = 'QUARTER',
}

export enum Action {
  REGISTER = 'REGISTER',
  DEREGISTER = 'DEREGISTER',
}

export enum Tick {
  HIT = 'HIT',
}

export interface HitTarget {
  instrument: string;
  onTick: number;
  action: Action;
  stream: Observable<Tick>;
}

@Injectable({ providedIn: 'root' })
export class SequencerService {
  private readonly subscriptions: Subscription[] = [];

  private readonly _observableEmitter = new ReplaySubject<HitTarget>();

  readonly observableEmitter$: Observable<HitTarget> = this._observableEmitter.asObservable();

  readonly ticks: Record<TickType, Observable<number>> = {
    [TickType.WHOLE]: this.timeService.beatTick$,
    [TickType.HALF]: this.timeService.halfTick$,
    [TickType.QUARTER]: this.timeService.quarterTick$,
  };

  // observables: Record<string, Observable<string>[]> = {
  //   snare: [],
  //   hat: [],
  // };

  constructor(private readonly timeService: TimeService) {}

  registerHit(onTick: number, forInstrument: string, _forTickType: TickType = TickType.QUARTER): void {
    // const stream = this.ticks[forTickType];
    const stream = this.timeService.beatTick$;
    const newObservable = this.buildHitStream(onTick, stream);

    this._observableEmitter.next({
      instrument: forInstrument,
      onTick: onTick,
      action: Action.REGISTER,
      stream: newObservable,
    });
  }

  deregisterHit(onTick: number, forInstrument: string, _forTickType: TickType = TickType.QUARTER): void {
    this._observableEmitter.next({
      instrument: forInstrument,
      onTick: onTick,
      action: Action.DEREGISTER,
      stream: NEVER,
    });
  }

  private buildHitStream(
    onTick: number,
    fromBeatStream: Observable<number> = this.timeService.quarterTick$
  ): Observable<Tick> {
    return fromBeatStream.pipe(
      map((tick) => {
        if (tick === onTick) {
          console.log('HIT', tick, onTick);
          return true;
        }
        return false;
      }),
      switchMap((didHit) => (didHit ? of(Tick.HIT) : NEVER))
    );
  }
}
