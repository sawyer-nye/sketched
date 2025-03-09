import { Injectable, inject } from '@angular/core';
import { PianoRollNote } from '../models/piano-roll-note.model';
import { SelectionBox } from '@app/components/piano-roll/piano-roll.interfaces';
import { PianoRollPositionService } from '@app/services/piano-roll-position.service';
import { Note } from '@app/models/note.model';

@Injectable({
  providedIn: 'root',
})
export class PianoRollSelectionService {
  private readonly positionService = inject(PianoRollPositionService);

  /**
   * Create selection box (directly extracted from piano-roll-view component)
   */
  createSelectionBox(x: number, y: number): SelectionBox {
    return {
      startX: x,
      startY: y,
      width: 0,
      height: 0,
    };
  }

  /**
   * Update selection box (directly extracted from piano-roll-view component)
   */
  updateSelectionBox(box: SelectionBox, x: number, y: number): SelectionBox {
    // Update dimensions
    return {
      ...box,
      width: x - box.startX,
      height: y - box.startY,
    };
  }

  /**
   * Get normalized selection box coordinates (directly extracted from piano-roll-view component)
   */
  getNormalizedBox(box: SelectionBox): { x: number; y: number; width: number; height: number } {
    // Handle negative width/height (selection in reverse direction)
    const x = box.width < 0 ? box.startX + box.width : box.startX;
    const y = box.height < 0 ? box.startY + box.height : box.startY;
    const width = Math.abs(box.width);
    const height = Math.abs(box.height);

    return { x, y, width, height };
  }

  /**
   * Find notes in selection box (directly extracted from piano-roll-view component)
   */
  getNotesInBox(
    box: SelectionBox,
    notes: PianoRollNote[],
    cellHeight: number,
    visibleNotes: Note[],
  ): PianoRollNote[] {
    // Get normalized box coordinates
    const { x, y, width, height } = this.getNormalizedBox(box);

    // Find all notes that overlap with the selection box
    return notes.filter((note) => {
      // Get the bounds of the note
      const noteTop = this.positionService.getNoteTop(note, visibleNotes);
      const noteLeft = this.positionService.getNoteLeft(note);
      const noteWidth = this.positionService.getNoteWidth(note);
      const noteHeight = cellHeight;

      // Check if the note overlaps with the selection box
      const noteRight = noteLeft + noteWidth;
      const noteBottom = noteTop + noteHeight;

      return noteRight > x && noteLeft < x + width && noteBottom > y && noteTop < y + height;
    });
  }

  /**
   * Add note to selection (directly extracted from piano-roll-view component)
   */
  addToSelection(note: PianoRollNote, selectedNotes: PianoRollNote[]): PianoRollNote[] {
    // Check if already selected
    const alreadySelected = selectedNotes.some(
      (n) =>
        n.note.name === note.note.name &&
        n.note.octave === note.note.octave &&
        n.startTime === note.startTime &&
        n.duration === note.duration,
    );

    if (alreadySelected) {
      return selectedNotes;
    }

    // Add to selection
    return [...selectedNotes, note];
  }

  /**
   * Remove note from selection (directly extracted from piano-roll-view component)
   */
  removeFromSelection(note: PianoRollNote, selectedNotes: PianoRollNote[]): PianoRollNote[] {
    return selectedNotes.filter(
      (n) =>
        n.note.name !== note.note.name ||
        n.note.octave !== note.note.octave ||
        n.startTime !== note.startTime ||
        n.duration !== note.duration,
    );
  }

  /**
   * Toggle note selection (directly extracted from piano-roll-view component)
   */
  toggleSelection(note: PianoRollNote, selectedNotes: PianoRollNote[]): PianoRollNote[] {
    // Check if already selected
    const alreadySelected = selectedNotes.some(
      (n) =>
        n.note.name === note.note.name &&
        n.note.octave === note.note.octave &&
        n.startTime === note.startTime &&
        n.duration === note.duration,
    );

    if (alreadySelected) {
      return this.removeFromSelection(note, selectedNotes);
    } else {
      return this.addToSelection(note, selectedNotes);
    }
  }
}
