import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusicService } from '@services/music/music.service';
import { ToneService } from '@services/tone/tone.service';
import { RootNoteSelectorComponent } from '@components/shared/root-note-selector/root-note-selector.component';
import { ScaleModeSelectorComponent } from '@components/shared/scale-mode-selector/scale-mode-selector.component';
import { MetronomeClickType, TimeService } from '@app/services/time/time.service';
import { Observable, Subscription, map, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Action, HitTarget, SequencerService } from '@app/services/sequencer/sequencer.service';

interface HitSubscription {
  instrument: string;
  onTick: number;
  subscription: Subscription;
}

@Component({
  standalone: true,
  imports: [CommonModule, RootNoteSelectorComponent, ScaleModeSelectorComponent, FormsModule],
  templateUrl: './sketch-view.component.html',
  styleUrls: ['./sketch-view.component.scss'],
})
export class SketchViewComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  private hitSubscriptions: HitSubscription[] = [];

  isMetronomeOn$: Observable<boolean> = this.timeService.isMetronomeOn$;
  isPlaying$: Observable<boolean> = this.timeService.isPlaying$;
  bpm$: Observable<number> = this.timeService.bpm$;
  numBeatsPerBar$: Observable<number> = this.timeService.numBeatsPerBar$;
  noteDurationPerBeat$: Observable<number> = this.timeService.beatValue$;
  beatTick$: Observable<number> = this.timeService.beatTick$;
  metronomeClick$: Observable<MetronomeClickType> = this.timeService.metronomeClick$;
  loopDuration$: Observable<number> = this.timeService.loopDuration$;

  constructor(
    private readonly musicService: MusicService,
    private readonly toneService: ToneService,
    private readonly timeService: TimeService,
    private readonly sequencerService: SequencerService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.metronomeClick$.pipe(tap((clickType) => this.toneService.playMetronomeClick(clickType))).subscribe(),
      this.timeService.halfTick$
        .pipe(
          map((tick) => tick === 1)
          // tap((shouldPlay) => (shouldPlay ? this.toneService.playMetronomeClick(MetronomeClickType.HALF_TIP) : NEVER))
        )
        .subscribe(),
      this.timeService.quarterTick$
        .pipe(
          map((tick) => tick === 1 || tick === 3)
          // tap((shouldPlay) =>
          //   shouldPlay ? this.toneService.playMetronomeClick(MetronomeClickType.QUARTER_TIP) : NEVER
          // )
        )
        .subscribe(),
      this.sequencerService.observableEmitter$
        .pipe(tap((hitTarget) => this.subscribeToNewObservable(hitTarget)))
        .subscribe()
    );
  }

  getRegisteredHit(forTick: number, forInstrument: string = 'snare'): HitSubscription | undefined {
    return this.hitSubscriptions.find((hitSub) => hitSub.instrument === forInstrument && hitSub.onTick === forTick);
  }

  toggleHit(forTick: number, forInstrument: string): void {
    const registeredHit = this.getRegisteredHit(forTick, forInstrument);
    if (registeredHit) {
      this.sequencerService.deregisterHit(forTick, forInstrument);
    } else {
      this.sequencerService.registerHit(forTick, forInstrument);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toggleIsMetronomeOn(): void {
    this.timeService.toggleIsMetronomeOn();
  }

  toggleIsPlaying(): void {
    this.timeService.toggleIsPlaying();
  }

  setBpm($event: Event): void {
    if (($event.target as HTMLInputElement).value) {
      this.timeService.setBpm(Number(($event.target as HTMLInputElement).value));
    }
  }

  setNumBeatsPerBar($event: Event): void {
    if (($event.target as HTMLInputElement).value) {
      this.timeService.setNumBeatsPerBar(Number(($event.target as HTMLInputElement).value));
    }
  }

  setNoteDurationPerBeat($event: Event): void {
    if (($event.target as HTMLInputElement).value) {
      this.timeService.setNoteDurationPerBeat(Number(($event.target as HTMLInputElement).value));
    }
  }

  setLoopDuration($event: Event): void {
    if (($event.target as HTMLInputElement).value) {
      this.timeService.setLoopDuration(Number(($event.target as HTMLInputElement).value));
    }
  }

  private subscribeToNewObservable(hitTarget: HitTarget): void {
    if (hitTarget.action === Action.REGISTER) {
      this.hitSubscriptions.push({
        instrument: hitTarget.instrument,
        onTick: hitTarget.onTick,
        subscription: this.timeService.beatTick$
          .pipe(
            tap((tickVal) => {
              const beatsPerBar = this.timeService.numBeatsPerBar;
              const loopDuration = this.timeService.loopDuration;
              if (tickVal % (beatsPerBar * loopDuration) === hitTarget.onTick) {
                this.toneService.playSample(hitTarget.instrument);
              }
            })
          )
          .subscribe(),
      });
    } else {
      const hitSub = this.getRegisteredHit(hitTarget.onTick, hitTarget.instrument);
      if (hitSub) {
        hitSub.subscription.unsubscribe();
        this.hitSubscriptions = this.hitSubscriptions.filter((sub) => sub !== hitSub);
      } else {
        console.log('should not happen !');
      }
    }
  }
}
