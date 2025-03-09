import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';
import { MusicService } from '../services/music/music.service';
import { GridRow } from '../components/piano-roll/piano-roll.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PianoRollGridService {
  readonly cellWidth = 40; // Width of one beat in pixels
  readonly cellHeight = 20; // Height of one note in pixels

  constructor(private musicService: MusicService) {}

  /**
   * Setup grid rows (directly extracted from piano-roll-view component)
   */
  setupGridRows(totalBeats: number): { gridRows: GridRow[]; visibleNotes: Note[] } {
    // Get visible notes from music service (use octave 3 and 4 notes)
    const visibleNotes = this.musicService.octaveThreeAndFourNotes;

    // Sort notes by position in descending order (highest notes first)
    const sortedNotes = [...visibleNotes].sort((a, b) => b.position - a.position);

    // Setup grid rows based on visible notes
    const gridRows = sortedNotes.map((note) => ({
      note,
      cells: Array.from({ length: totalBeats }, (_, i) => ({ beat: i + 1 })),
    }));

    return { gridRows, visibleNotes: sortedNotes };
  }

  /**
   * Setup grid beats (directly extracted from piano-roll-view component)
   */
  setupGridBeats(totalBeats: number): number[] {
    // Setup beats (horizontal markers)
    return Array.from({ length: totalBeats }, (_, i) => i + 1);
  }

  /**
   * Get grid coordinates from mouse event (directly extracted from piano-roll-view component)
   */
  getGridCoordinates(event: MouseEvent, container: HTMLElement): { beatIndex: number; noteIndex: number } {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top - 30; // Adjust for time indicators height

    // Calculate grid position
    const beatIndex = Math.floor(x / this.cellWidth);
    const noteIndex = Math.floor(y / this.cellHeight);

    return { beatIndex, noteIndex };
  }

  /**
   * Check if grid coordinates are within bounds (directly extracted from piano-roll-view component)
   */
  isWithinBounds(noteIndex: number, beatIndex: number, totalNotes: number, totalBeats: number): boolean {
    return noteIndex >= 0 && noteIndex < totalNotes && beatIndex >= 0 && beatIndex < totalBeats;
  }
}
