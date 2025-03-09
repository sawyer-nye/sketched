import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Note } from '@app/models/note.model';
import { PianoRollNote } from '@app/models/piano-roll-note.model';
import { PianoRollStateService } from '@app/services/piano-roll-state.service';
import { TrackService } from '@app/services/track/track.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-piano-roll-track-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="track-selection" *ngIf="data$ | async as data">
      <button (click)="createNewTrack()">Add Track</button>
      <select [value]="data.currentTrack" (change)="onTrackSelectionChange($event)">
        <option *ngFor="let track of data.tracks" [value]="track.id">
          {{ track.name }}
        </option>
      </select>

      <!-- Mode toggle button -->
      <button
        (click)="pianoRollStateService.toggleIsPencilMode()"
        class="mode-toggle"
        [class.active]="data.isPencilMode"
        title="Toggle between selection and pencil modes"
      >
        <span class="icon">✏️</span>
      </button>

      <!-- Debug button -->
      <button (click)="showDebugInfo()" class="debug-button">Debug</button>

      <!-- Test pattern button -->
      <button (click)="addTestPattern()" class="test-pattern-button">Test Pattern</button>
    </div>
  `,
  styleUrls: ['./piano-roll-track-selection.component.scss'],
})
export class PianoRollTrackSelectionComponent {
  @Input() visibleNotes: Note[] = [];

  protected readonly trackService = inject(TrackService);
  protected readonly pianoRollStateService = inject(PianoRollStateService);

  data$ = combineLatest({
    isPencilMode: this.pianoRollStateService.isPencilMode$,
    currentTrack: this.trackService.currentTrack$,
    tracks: this.trackService.tracks$,
  });

  createNewTrack() {
    this.trackService.createTrack();
  }

  onTrackSelectionChange(event: Event) {
    const selectedTrackId = (event.target as HTMLSelectElement).value;
    this.trackService.setCurrentTrack(selectedTrackId);
  }

  showDebugInfo() {
    const currentTrack = this.trackService.getCurrentTrack();

    if (!currentTrack) {
      console.log('No track selected');
      return;
    }

    console.log('Current Track:', {
      id: currentTrack.id,
      name: currentTrack.name,
      instrumentType: currentTrack.instrumentType,
      noteCount: currentTrack.notes.length,
    });

    console.log('Notes:');
    currentTrack.notes.forEach((note, index) => {
      console.log(`Note ${index}:`, {
        pitch: this.getNoteLabel(note.note),
        startTime: note.startTime,
        beat: Math.floor(note.startTime) + 1,
        duration: note.duration,
        velocity: note.velocity,
      });
    });
  }

  addTestPattern(): void {
    const currentTrack = this.trackService.getCurrentTrack();

    if (!currentTrack) {
      console.log('No track selected');
      return;
    }

    // Clear existing notes
    this.trackService.clearNotes();

    // Add a simple ascending pattern (one note every other beat)
    for (let i = 0; i < 8; i++) {
      // Every other position in the visible notes array (to create a scale pattern)
      const noteIndex = i * 2;
      if (noteIndex < this.visibleNotes.length) {
        const note = this.visibleNotes[noteIndex];

        const newNote: PianoRollNote = {
          note: { ...note },
          startTime: i * 2, // Place notes on even-numbered beats (0, 2, 4, 6, etc.)
          duration: 1, // Each note is 1 beat long
          velocity: 0.8,
        };

        this.trackService.addNote(newNote);
      }
    }

    // Update the track
    console.log('Added test pattern with', this.trackService.getCurrentTrack()!.notes.length, 'notes');

    // Show the debug info
    this.showDebugInfo();
  }

  private getNoteLabel(note: Note): string {
    // Format as C3, C#3, etc.
    const noteName = note.name.replace('_SHARP', '#');
    return `${noteName}${note.octave}`;
  }
}
