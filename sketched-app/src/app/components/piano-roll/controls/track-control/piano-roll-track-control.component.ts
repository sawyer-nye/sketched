import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InstrumentType } from '@app/models/piano-roll-note.model';
import { TrackService } from '@app/services/track/track.service';
import { combineLatest, filter } from 'rxjs';

@Component({
  selector: 'app-piano-roll-track-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="data$ | async as data">
      <div class="track-info" *ngIf="data.currentTrack">
        <input
          type="text"
          [(ngModel)]="data.currentTrack.name"
          (ngModelChange)="updateTrack(data.currentTrack!)"
          placeholder="Track Name"
        />
        <select [(ngModel)]="data.currentTrack.instrumentType" (ngModelChange)="updateTrack(data.currentTrack)">
          <option [value]="InstrumentType.MONO_SYNTH">Mono Synth</option>
          <option [value]="InstrumentType.POLY_SYNTH">Poly Synth</option>
          <option [value]="InstrumentType.MONO_SAMPLE">Snare</option>
          <option [value]="InstrumentType.POLY_SAMPLE">Hat</option>
        </select>
        <div class="track-controls">
          <button (click)="toggleTrackMute()" [class.active]="data.currentTrack.isMuted">M</button>
          <button (click)="toggleTrackSolo()" [class.active]="data.currentTrack.isSolo">S</button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            [(ngModel)]="data.currentTrack.volume"
            (ngModelChange)="updateTrack(data.currentTrack)"
          />
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./piano-roll-track-control.component.scss'],
})
export class PianoRollTrackControlComponent {
  private readonly trackService = inject(TrackService);

  protected InstrumentType = InstrumentType;

  updateTrack = this.trackService.updateTrack.bind(this.trackService);

  toggleTrackMute(): void {
    const currentTrack = this.trackService.getCurrentTrack();

    if (!currentTrack) return;

    this.trackService.updateTrack({
      ...currentTrack,
      isMuted: !currentTrack.isMuted,
    });
  }

  toggleTrackSolo(): void {
    const currentTrack = this.trackService.getCurrentTrack();

    if (!currentTrack) return;

    this.trackService.updateTrack({
      ...currentTrack,
      isSolo: !currentTrack.isSolo,
    });
  }

  data$ = combineLatest({
    currentTrack: this.trackService.currentTrack$.pipe(filter((track) => track !== null)),
  });
}
