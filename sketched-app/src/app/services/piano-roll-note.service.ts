import { Injectable } from '@angular/core';
import { ToneService } from '../services/tone/tone.service';
import { TrackService } from '../services/track/track.service';
import { Note } from '../models/note.model';
import { PianoRollNote, Track } from '../models/piano-roll-note.model';

@Injectable({
  providedIn: 'root',
})
export class PianoRollNoteService {
  constructor(
    private toneService: ToneService,
    private trackService: TrackService,
  ) {}

  /**
   * Create a new note (directly extracted from piano-roll-view component)
   */
  createNewNote(track: Track, beatIndex: number, note: Note): PianoRollNote {
    // Create a new note - ensure start time is an integer for clean beat boundaries
    const newNote: PianoRollNote = {
      note: { ...note },
      startTime: beatIndex, // Exact beat position (integer)
      duration: 1,
      velocity: 0.8,
    };

    track.notes.push(newNote);
    this.trackService.updateTrack(track);

    // Play the note as feedback - use low velocity for preview
    this.toneService.playNote(note, 0.5);

    console.log(`Created note at beat ${beatIndex + 1} (${this.getNoteLabel(note)})`);

    return newNote;
  }

  /**
   * Delete a note (directly extracted from piano-roll-view component)
   */
  deleteNote(track: Track, note: PianoRollNote): void {
    const index = track.notes.findIndex(
      (n: PianoRollNote) =>
        n.note.name === note.note.name &&
        n.note.octave === note.note.octave &&
        n.startTime === note.startTime &&
        n.duration === note.duration,
    );

    if (index !== -1) {
      track.notes.splice(index, 1);
      this.trackService.updateTrack(track);
    }
  }

  /**
   * Find a note at specific grid position (directly extracted from piano-roll-view component)
   */
  findNoteAt(track: Track, beatIndex: number, noteIndex: number, visibleNotes: Note[]): PianoRollNote | null {
    if (!track || noteIndex < 0 || noteIndex >= visibleNotes.length) {
      return null;
    }

    const targetNote = visibleNotes[noteIndex];

    // Find a note in the track that matches this position and note
    const foundNote = track.notes.find((n: PianoRollNote) => {
      const startBeat = Math.floor(n.startTime);
      const endBeat = Math.floor(n.startTime + n.duration);
      return (
        n.note.name === targetNote.name &&
        n.note.octave === targetNote.octave &&
        beatIndex >= startBeat &&
        beatIndex < endBeat
      );
    });

    return foundNote || null;
  }

  /**
   * Get note label (directly extracted from piano-roll-view component)
   */
  getNoteLabel(note: Note): string {
    return `${note.name}${note.octave}`;
  }

  /**
   * Check if a note is a black key (directly extracted from piano-roll-view component)
   */
  isBlackKey(note: Note): boolean {
    return note.name.includes('#');
  }

  /**
   * Play a note (directly extracted from piano-roll-view component)
   */
  playNote(note: Note): void {
    this.toneService.playNote(note, 0.8);
  }
}
