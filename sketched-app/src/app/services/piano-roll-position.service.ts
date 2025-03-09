import { Injectable } from '@angular/core';
import { PianoRollNote } from '../models/piano-roll-note.model';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class PianoRollPositionService {
  readonly cellWidth = 40; // Width of one beat in pixels
  readonly cellHeight = 20; // Height of one note in pixels

  constructor() {}

  /**
   * Get note top position (directly extracted from piano-roll-view component)
   */
  getNoteTop(note: PianoRollNote, visibleNotes: Note[]): number {
    // Find the index of this note in the visible notes array
    // (which is sorted with highest notes at the top)
    const noteIndex = visibleNotes.findIndex((n) => n.name === note.note.name && n.octave === note.note.octave);

    // If found, return the top position (row index * cell height)
    if (noteIndex !== -1) {
      return noteIndex * this.cellHeight;
    }

    // Fallback return 0 if note not found in visible notes
    return 0;
  }

  /**
   * Get note left position (directly extracted from piano-roll-view component)
   */
  getNoteLeft(note: PianoRollNote): number {
    return note.startTime * this.cellWidth;
  }

  /**
   * Get note width (directly extracted from piano-roll-view component)
   */
  getNoteWidth(note: PianoRollNote): number {
    return note.duration * this.cellWidth;
  }

  /**
   * Calculate playback position in pixels (for timeline indicator)
   */
  getPlaybackPositionPixels(position: number): number {
    return position * this.cellWidth;
  }

  /**
   * Calculate the beat from a horizontal pixel position
   */
  getBeatFromX(x: number): number {
    return Math.floor(x / this.cellWidth);
  }

  /**
   * Calculate the note index from a vertical pixel position
   */
  getNoteIndexFromY(y: number): number {
    return Math.floor(y / this.cellHeight);
  }

  /**
   * Get the delta beats when resizing a note
   */
  getResizeDeltaBeats(deltaX: number): number {
    return Math.round(deltaX / this.cellWidth);
  }

  /**
   * Calculate total width of piano roll (in pixels)
   */
  getTotalWidth(totalBeats: number): number {
    return totalBeats * this.cellWidth;
  }

  /**
   * Calculate total height of piano roll (in pixels)
   */
  getTotalHeight(totalNotes: number): number {
    return totalNotes * this.cellHeight;
  }
}
