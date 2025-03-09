import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { TimeService } from '@services/time/time.service';
import { ToneService } from '@services/tone/tone.service';
import { MusicService } from '@services/music/music.service';
import { SequencerService, Action, HitTarget } from '@services/sequencer/sequencer.service';
import { TrackService } from '@services/track/track.service';

import { Note } from '@models/note.model';
import { PianoRollNote, Track } from '@models/piano-roll-note.model';
import { NoteName } from '@enums/note-name.enum';
import { PianoRollGridService } from '@app/services/piano-roll-grid.service';
import { PianoRollPositionService } from '@app/services/piano-roll-position.service';
import { PianoRollSelectionService } from '@app/services/piano-roll-selection.service';
import { PianoRollNoteService } from '@app/services/piano-roll-note.service';
import { GridRow, HitSubscription, SelectionBox } from '@app/components/piano-roll/piano-roll.interfaces';

@Component({
  selector: 'app-piano-roll-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './piano-roll-view.component.html',
  styleUrls: ['./piano-roll-view.component.scss'],
})
export class PianoRollViewComponent implements OnInit, OnDestroy {
  private readonly gridService = inject(PianoRollGridService);
  private readonly positionService = inject(PianoRollPositionService);
  private readonly selectionService = inject(PianoRollSelectionService);
  private readonly noteService = inject(PianoRollNoteService);

  protected getNoteTop = this.positionService.getNoteTop;
  protected getNoteLeft = this.positionService.getNoteLeft;
  protected getNoteWidth = this.positionService.getNoteWidth;

  // Piano roll configuration
  private readonly cellWidth = 40; // Width of one beat in pixels
  cellHeight = 20; // Height of one note in pixels
  gridBeats: number[] = [];
  gridRows: GridRow[] = [];
  visibleNotes: Note[] = [];
  totalBeats = 16; // Default length of piano roll
  playbackPosition = 0;

  // Drawing and interaction variables
  isDrawing = false;
  selectedNote: PianoRollNote | null = null; // Keep for backward compatibility
  selectedNotes: PianoRollNote[] = []; // New array for multi-select
  isDragging = false;
  isResizing = false;
  dragStartPosition = { x: 0, y: 0 };

  // Selection box for multi-select
  isSelecting = false;
  selectionBox: SelectionBox | null = null;

  // Track data
  currentTrack: Track | null = null;

  // Editing mode
  isPencilMode = false;

  // Playback state
  isPlaying = false;
  private subscriptions: Subscription[] = [];
  private hitSubscriptions: HitSubscription[] = []; // Track hit subscriptions

  constructor(
    private timeService: TimeService,
    private toneService: ToneService,
    private musicService: MusicService,
    private sequencerService: SequencerService,
    public trackService: TrackService,
  ) {}

  ngOnInit(): void {
    this.setupGrid();
    this.setupTrackObservables();
    this.setupPlaybackTracking();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());

    // Also clean up hit subscriptions
    this.hitSubscriptions.forEach((hitSub) => hitSub.subscription.unsubscribe());

    // Clean up any active event listeners
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
  }

  setupGrid(): void {
    this.gridBeats = this.gridService.setupGridBeats(this.totalBeats);
    const { gridRows, visibleNotes } = this.gridService.setupGridRows(this.totalBeats);
    this.gridRows = gridRows;
    this.visibleNotes = visibleNotes;
  }

  setupTrackObservables(): void {
    // Subscribe to the current track
    this.subscriptions.push(
      this.trackService.currentTrack$.pipe(filter((track) => track !== null)).subscribe((track: Track | null) => {
        this.currentTrack = track;
      }),
    );
  }

  setupPlaybackTracking(): void {
    // Track the current beat for playback visualization
    const beatTracking = this.timeService.beatTick$.pipe(
      map((beat) => {
        // Convert beat to pixel position
        this.playbackPosition = (beat - 1) * this.cellWidth;
        return beat;
      }),
    );

    this.subscriptions.push(beatTracking.subscribe());

    // Subscribe to sequencer events to register/deregister hit subscriptions
    this.subscriptions.push(
      this.sequencerService.observableEmitter$.pipe(tap((hitTarget) => this.handleHitTarget(hitTarget))).subscribe(),
    );
  }

  // Handle sequencer hit targets (similar to sketch-view)
  private handleHitTarget(hitTarget: HitTarget): void {
    if (hitTarget.action === Action.REGISTER) {
      // New hit registration
      this.registerHitSubscription(hitTarget);
    } else {
      // Deregister a hit
      this.deregisterHitSubscription(hitTarget);
    }
  }

  // Register a new hit subscription
  private registerHitSubscription(hitTarget: HitTarget): void {
    // Check if we already have this hit subscription
    const existingHit = this.getHitSubscription(hitTarget.onTick, hitTarget.instrument);
    if (existingHit) {
      return; // Already registered
    }

    console.log(`Registering hit for tick ${hitTarget.onTick}, track ${hitTarget.instrument}`);

    // Create a new subscription that will trigger when the beat matches
    const subscription = this.timeService.beatTick$
      .pipe(
        tap((tickVal) => {
          const beatsPerBar = this.timeService.numBeatsPerBar;
          const loopDuration = this.timeService.loopDuration;

          // Check if this tick matches our target tick
          if (tickVal % (beatsPerBar * loopDuration) === hitTarget.onTick) {
            console.log(`Tick ${tickVal} matches target ${hitTarget.onTick} for track ${hitTarget.instrument}`);

            // Find and play the notes at this beat
            if (this.currentTrack && this.currentTrack.id === hitTarget.instrument) {
              this.playNotesAtBeat(hitTarget.onTick);
            }
          }
        }),
      )
      .subscribe();

    // Store the subscription
    this.hitSubscriptions.push({
      trackId: hitTarget.instrument,
      onTick: hitTarget.onTick,
      subscription,
    });
  }

  // Deregister a hit subscription
  private deregisterHitSubscription(hitTarget: HitTarget): void {
    const hitSub = this.getHitSubscription(hitTarget.onTick, hitTarget.instrument);
    if (hitSub) {
      console.log(`Deregistering hit for tick ${hitTarget.onTick}, track ${hitTarget.instrument}`);
      hitSub.subscription.unsubscribe();
      this.hitSubscriptions = this.hitSubscriptions.filter((sub) => sub !== hitSub);
    }
  }

  // Helper to find an existing hit subscription
  private getHitSubscription(onTick: number, trackId: string): HitSubscription | undefined {
    return this.hitSubscriptions.find((hitSub) => hitSub.trackId === trackId && hitSub.onTick === onTick);
  }

  // Utility method to check if an instrument is monophonic
  private isMonophonic(instrumentId: string): boolean {
    // These instruments can only play one note at a time
    return instrumentId === 'monosynth';
  }

  // Play all notes at a specific beat
  playNotesAtBeat(beat: number): void {
    if (!this.isPlaying || !this.currentTrack || this.currentTrack.isMuted) {
      return;
    }

    console.log(`Looking for notes at beat ${beat}`);

    // Find all notes that start at this beat
    const notesToPlay = this.currentTrack.notes.filter((note) => Math.floor(note.startTime) + 1 === beat);

    console.log(`Found ${notesToPlay.length} notes to play at beat ${beat}`);

    // If this is a monophonic instrument, only play the highest note
    if (this.isMonophonic(this.currentTrack.instrumentId) && notesToPlay.length > 1) {
      // Find the note with the highest position (highest pitch)
      const highestNote = notesToPlay.reduce((highest, current) =>
        current.note.position > highest.note.position ? current : highest,
      );

      console.log(`Playing highest note for MonoSynth: ${this.getNoteLabel(highestNote.note)}`);
      this.toneService.playNote(highestNote.note, highestNote.velocity);
    }
    // For polyphonic instruments or single notes, play all notes
    else {
      notesToPlay.forEach((note) => {
        console.log(`Playing note: ${this.getNoteLabel(note.note)}`);
        this.toneService.playNote(note.note, note.velocity);
      });
    }
  }

  // UI Event handlers
  togglePlayback(): void {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      console.log('Starting playback...');

      // Register all notes with the sequencer first
      this.trackService.registerAllTracksForPlayback();

      // Then start the timer service
      this.timeService.toggleIsPlaying();
    } else {
      console.log('Stopping playback...');

      // Stop the timer first
      this.timeService.toggleIsPlaying();

      // Then clean up any sequencer registrations
      this.trackService.deregisterAllTracksFromPlayback();

      // Reset playback position
      this.playbackPosition = 0;
    }
  }

  createNewTrack(): void {
    this.trackService.createTrack();
  }

  onTrackSelectionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.trackService.setCurrentTrack(select.value);
  }

  // Update startDrawing to handle selection box in selection mode
  startDrawing(event: MouseEvent): void {
    if (!this.currentTrack) return;

    // Only start dragging if left mouse button is pressed
    if (event.button !== 0) return;

    const gridContainer = event.currentTarget as HTMLElement;
    const { beatIndex, noteIndex } = this.gridService.getGridCoordinates(event, gridContainer);

    const rect = gridContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top - 30; // Adjust for time indicators height

    // Make sure we're in bounds
    if (noteIndex < 0 || noteIndex >= this.visibleNotes.length || beatIndex < 0 || beatIndex >= this.totalBeats) {
      return;
    }

    // Check if a note exists at this position
    const existingNote = this.findNoteAt(beatIndex, noteIndex);

    // Handle based on current mode
    if (this.isPencilMode) {
      // PENCIL MODE
      this.isDrawing = true;

      // Only create new notes in empty spaces
      // (clicking on existing notes is handled by the selectNote method)
      if (!existingNote) {
        // Get the note at this index in the sorted array
        const note = this.visibleNotes[noteIndex];

        // Create a new note
        const newNote: PianoRollNote = {
          note: { ...note },
          startTime: beatIndex, // Exact beat position (integer)
          duration: 1, // Start with 1 beat and extend with dragging
          velocity: 0.8,
        };

        this.currentTrack.notes.push(newNote);
        this.trackService.updateTrack(this.currentTrack);

        // Set this as the selected note for potential duration extension
        this.selectedNote = newNote;
        this.selectedNotes = [newNote];

        // Play the note as feedback
        this.toneService.playNote(note, 0.5);

        console.log(`Created note at beat ${beatIndex + 1} (${this.getNoteLabel(note)})`);
      }
    } else {
      // SELECTION MODE
      // If clicking on a note, handle as before
      if (existingNote) {
        // Check if the Ctrl key is pressed for multi-select
        if (event.ctrlKey || event.metaKey) {
          // Toggle selection for this note
          const index = this.selectedNotes.indexOf(existingNote);
          if (index > -1) {
            this.selectedNotes.splice(index, 1);
            if (this.selectedNotes.length > 0) {
              this.selectedNote = this.selectedNotes[0];
            } else {
              this.selectedNote = null;
            }
          } else {
            this.selectedNotes.push(existingNote);
            this.selectedNote = existingNote;
            this.toneService.playNote(existingNote.note, 0.5);
          }
        } else {
          // If not pressing Ctrl/Cmd, clear selection and select just this note
          if (!this.selectedNotes.includes(existingNote)) {
            this.selectedNotes = [existingNote];
            this.selectedNote = existingNote;
            this.toneService.playNote(existingNote.note, 0.5);
          }
        }

        // Start dragging if we have selected notes
        if (this.selectedNotes.length > 0) {
          this.isDragging = true;
          this.dragStartPosition = { x, y };
        }
      } else {
        // Clicking on empty space starts a selection box
        // If not holding Ctrl/Cmd, clear the current selection
        if (!event.ctrlKey && !event.metaKey) {
          this.selectedNotes = [];
          this.selectedNote = null;
        }

        this.isSelecting = true;
        this.selectionBox = this.selectionService.createSelectionBox(x, y);
      }
    }
  }

  // Updated drawNote to handle selection box and multi-select dragging
  drawNote(event: MouseEvent): void {
    if (!this.currentTrack) return;

    const gridContainer = event.currentTarget as HTMLElement;
    const rect = gridContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top - 30; // Adjust for time indicators height

    if (this.isPencilMode) {
      this.handlePencilModeDrawing(x);
    } else {
      if (this.isSelecting && this.selectionBox) {
        this.handleSelectionBoxUpdate(x, y);
      } else if (this.isDragging && this.selectedNotes.length > 0) {
        this.handleNoteDragging(x, y);
      } else if (this.isResizing && this.selectedNote) {
        this.handleNoteResizing(x);
      }
    }
  }

  private handlePencilModeDrawing(x: number): void {
    if (!this.isDrawing || !this.selectedNote) return;

    // Calculate the beat position
    const currentBeat = this.positionService.getBeatFromX(x);

    // Calculate the new duration (minimum 1)
    const startBeat = this.selectedNote.startTime;
    const newDuration = Math.max(1, currentBeat - startBeat + 1);

    // Ensure we don't go beyond the total beats
    const maxDuration = this.totalBeats - startBeat;
    this.selectedNote.duration = Math.min(newDuration, maxDuration);

    // Update the track with the modified note
    this.trackService.updateTrack(this.currentTrack!);
  }

  private handleSelectionBoxUpdate(x: number, y: number): void {
    if (!this.selectionBox) return;

    // Update selection box dimensions
    this.selectionBox = this.selectionService.updateSelectionBox(this.selectionBox, x, y);

    // Update the visual selection box in the UI
    this.updateSelectionBoxVisual();

    // Select notes that are within the selection box
    this.selectNotesInBox();
  }

  private handleNoteDragging(x: number, y: number): void {
    // Calculate movement in exact pixel values first - don't round to grid cells yet
    const pixelDeltaX = x - this.dragStartPosition.x;
    const pixelDeltaY = y - this.dragStartPosition.y;

    // Only process if there's significant movement (more than 2 pixels)
    if (Math.abs(pixelDeltaX) > 2 || Math.abs(pixelDeltaY) > 2) {
      // Calculate grid movement based on pixel movement
      const beatDifference = this.positionService.getBeatFromX(pixelDeltaX);
      const noteDifference = this.positionService.getNoteIndexFromY(pixelDeltaY);

      // Only apply changes if there's actual grid movement
      if (beatDifference !== 0 || noteDifference !== 0) {
        this.moveSelectedNotes(beatDifference, noteDifference);

        // Update drag start position based on the applied grid movements
        this.dragStartPosition.x += beatDifference * this.cellWidth;
        this.dragStartPosition.y += noteDifference * this.cellHeight;
      }
    }
  }

  private moveSelectedNotes(beatDifference: number, noteDifference: number): void {
    this.selectedNotes.forEach((note) => {
      // Store original positions for restoration if needed
      const originalStartTime = note.startTime;
      const originalNote = { ...note.note };

      // Handle horizontal movement (changing start time)
      if (beatDifference !== 0) {
        const newStartTime = Math.max(0, originalStartTime + beatDifference);
        const maxStart = this.totalBeats - note.duration;
        note.startTime = Math.min(newStartTime, maxStart);
      }

      // Handle vertical movement (changing pitch)
      if (noteDifference !== 0) {
        this.updateNotePitch(note, originalNote, noteDifference);
      }
    });

    // Update the track with the modified notes
    this.trackService.updateTrack(this.currentTrack!);
  }

  private updateNotePitch(note: PianoRollNote, originalNote: Note, noteDifference: number): void {
    // Find the current index of the note in visibleNotes
    const currentNoteIndex = this.visibleNotes.findIndex(
      (n) => n.position === originalNote.position && n.octave === originalNote.octave,
    );

    // Calculate the new index, ensuring it stays within bounds
    const newNoteIndex = Math.max(0, Math.min(currentNoteIndex + noteDifference, this.visibleNotes.length - 1));

    // If the index changed, update the note
    if (newNoteIndex !== currentNoteIndex) {
      // Update the note to the new pitch
      note.note = { ...this.visibleNotes[newNoteIndex] };

      // Play the new note at a lower velocity for feedback if it's the primary selected note
      if (note === this.selectedNote) {
        this.toneService.playNote(note.note, 0.3);
      }
    }
  }

  private handleNoteResizing(x: number): void {
    // Calculate the grid position
    const currentBeat = this.positionService.getBeatFromX(x);

    // Calculate the new duration based on the beat difference
    const startBeat = this.selectedNote!.startTime;
    const newDuration = Math.max(1, currentBeat - startBeat + 1);

    // Find the resize ratio to apply to all selected notes
    const resizeRatio = newDuration / this.selectedNote!.duration;

    // Update all selected notes with the same resize ratio
    this.resizeSelectedNotes(newDuration, resizeRatio);

    // Update the track with all modified notes
    this.trackService.updateTrack(this.currentTrack!);
  }

  private resizeSelectedNotes(newDuration: number, resizeRatio: number): void {
    this.selectedNotes.forEach((note) => {
      if (note !== this.selectedNote) {
        // For other notes, calculate a scaled duration
        const scaledDuration = Math.max(1, Math.round(note.duration * resizeRatio));
        // Ensure we don't go beyond the total beats
        const maxDuration = this.totalBeats - note.startTime;
        note.duration = Math.min(scaledDuration, maxDuration);
      }
    });

    // Update the primary selected note
    const maxDuration = this.totalBeats - this.selectedNote!.startTime;
    this.selectedNote!.duration = Math.min(newDuration, maxDuration);
  }

  // Add method to update the selection box visual element
  private updateSelectionBoxVisual(): void {
    const selectionBoxElement = document.getElementById('selection-box');
    if (!selectionBoxElement || !this.selectionBox) return;

    // Calculate absolute dimensions for the box
    const left =
      this.selectionBox.width >= 0 ? this.selectionBox.startX : this.selectionBox.startX + this.selectionBox.width;
    const top =
      this.selectionBox.height >= 0 ? this.selectionBox.startY : this.selectionBox.startY + this.selectionBox.height;
    const width = Math.abs(this.selectionBox.width);
    const height = Math.abs(this.selectionBox.height);

    // Update the position and size
    selectionBoxElement.style.left = `${left}px`;
    selectionBoxElement.style.top = `${top}px`;
    selectionBoxElement.style.width = `${width}px`;
    selectionBoxElement.style.height = `${height}px`;
    selectionBoxElement.style.display = 'block';
  }

  // Method to select notes that are within the selection box
  private selectNotesInBox(): void {
    if (!this.selectionBox || !this.currentTrack) return;

    // Clear previous selection if not in add mode (Ctrl key)
    if (!this.selectedNotes.length) {
      this.selectedNotes = [];
    }

    this.selectedNotes = this.selectionService.getNotesInBox(
      this.selectionBox,
      this.currentTrack.notes,
      this.cellHeight,
      this.visibleNotes,
    );

    // Update the primary selected note
    if (this.selectedNotes.length > 0) {
      this.selectedNote = this.selectedNotes[0];
    } else {
      this.selectedNote = null;
    }
  }

  // Updated selectNote to handle multi-select and initiate dragging
  selectNote(note: PianoRollNote, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click from triggering other handlers

    // Different behavior based on mode
    if (this.isPencilMode) {
      // In pencil mode, clicking a note deletes it
      this.deleteNote(note);
    } else {
      // In regular mode, handle selection with Ctrl key for multi-select
      if (event.ctrlKey || event.metaKey) {
        // Toggle selection for this note
        const index = this.selectedNotes.indexOf(note);
        if (index > -1) {
          this.selectedNotes.splice(index, 1);
          if (this.selectedNotes.length > 0) {
            this.selectedNote = this.selectedNotes[0];
          } else {
            this.selectedNote = null;
          }
        } else {
          this.selectedNotes.push(note);
          this.selectedNote = note;
        }
      } else {
        // If not pressing Ctrl/Cmd, select only this note
        this.selectedNotes = [note];
        this.selectedNote = note;
      }

      // Play the note at a lower velocity as feedback
      this.toneService.playNote(note.note, 0.5);

      console.log(`Selected note: ${this.getNoteLabel(note.note)} at beat ${Math.floor(note.startTime) + 1}`);

      // Important: Initiate dragging when clicking on a note in selection mode
      this.isDragging = true;

      // Get grid container element for accurate coordinate calculation
      let gridContainer = null;
      const noteElement = event.currentTarget as HTMLElement;
      let parentEl = noteElement.parentElement;

      // Find the grid container by traversing up the DOM
      while (parentEl && !gridContainer) {
        if (parentEl.classList.contains('grid-container')) {
          gridContainer = parentEl;
        }
        parentEl = parentEl.parentElement;
      }

      // Store the starting position for drag calculations
      if (gridContainer) {
        const rect = gridContainer.getBoundingClientRect();
        this.dragStartPosition = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top - 30, // Adjust for time indicators height
        };
      } else {
        // Fallback if we can't find the grid container
        this.dragStartPosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    }
  }

  // Helper method to delete a note
  deleteNote(note: PianoRollNote): void {
    if (!this.currentTrack) return;

    const noteLabel = this.getNoteLabel(note.note);
    const beatPosition = Math.floor(note.startTime) + 1;

    // Remove the note from the track
    this.currentTrack.notes = this.currentTrack.notes.filter((n) => n !== note);

    // Update the track
    this.trackService.updateTrack(this.currentTrack);

    console.log(`Deleted note ${noteLabel} at beat ${beatPosition}`);
  }

  playNote(note: Note): void {
    this.toneService.playNote(note);
  }

  // Utility functions
  isBlackKey(note: Note): boolean {
    return (
      note.name === NoteName.C_SHARP ||
      note.name === NoteName.D_SHARP ||
      note.name === NoteName.F_SHARP ||
      note.name === NoteName.G_SHARP ||
      note.name === NoteName.A_SHARP
    );
  }

  getNoteLabel(note: Note): string {
    // Format as C3, C#3, etc.
    const noteName = note.name.replace('_SHARP', '#');
    return `${noteName}${note.octave}`;
  }

  private findNoteAt(beatIndex: number, noteIndex: number): PianoRollNote | null {
    if (!this.currentTrack || noteIndex < 0 || noteIndex >= this.visibleNotes.length) return null;

    // Get the note at this position in our reversed grid
    const noteAtPosition = this.visibleNotes[noteIndex];

    return (
      this.currentTrack.notes.find(
        (note) =>
          note.note.position === noteAtPosition.position &&
          note.note.octave === noteAtPosition.octave &&
          beatIndex >= note.startTime &&
          beatIndex < note.startTime + note.duration,
      ) || null
    );
  }

  // Enhanced keyboard event handler for deleting notes
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // Delete selected notes when Delete or Backspace is pressed
    if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedNotes.length > 0 && this.currentTrack) {
      console.log(`Deleting ${this.selectedNotes.length} selected notes`);
      this.deleteSelectedNotes();
      event.preventDefault();
    }
  }

  // Enhanced method for deleting selected notes
  deleteSelectedNotes(): void {
    if (this.selectedNotes.length === 0 || !this.currentTrack) return;

    // Remove all selected notes from the track
    this.currentTrack.notes = this.currentTrack.notes.filter((note) => !this.selectedNotes.includes(note));

    // Update the track
    this.trackService.updateTrack(this.currentTrack);

    // Clear selection
    this.selectedNotes = [];
    this.selectedNote = null;

    console.log(`Deleted ${this.selectedNotes.length} notes`);
  }

  // Update for backward compatibility
  deleteSelectedNote(): void {
    this.deleteSelectedNotes();
  }

  startResizing(event: MouseEvent, note: PianoRollNote): void {
    // Prevent the note selection handler from firing
    event.stopPropagation();

    if (!this.currentTrack) return;

    this.isResizing = true;

    // If the note isn't in the selection, select only this note
    if (!this.selectedNotes.includes(note)) {
      this.selectedNotes = [note];
    }

    this.selectedNote = note; // The primary note being resized

    this.dragStartPosition = {
      x: event.clientX,
      y: event.clientY,
    };

    // Setup global event listeners for mouse movements
    document.addEventListener('mousemove', this.handleResizeMove);
    document.addEventListener('mouseup', this.handleResizeEnd);
  }

  // Handle when drawing/dragging stops
  stopDrawing(): void {
    // Hide the selection box if it was being drawn
    if (this.isSelecting) {
      const selectionBoxElement = document.getElementById('selection-box');
      if (selectionBoxElement) {
        selectionBoxElement.style.display = 'none';
      }
    }

    // Provide audio feedback and logging when appropriate
    if (this.isPencilMode) {
      if (this.isDrawing && this.selectedNote) {
        // Play the note when we finish drawing as audio feedback
        this.toneService.playNote(this.selectedNote.note, 0.5);
        console.log(
          `Created note with duration ${this.selectedNote.duration} at beat ${Math.floor(this.selectedNote.startTime) + 1}`,
        );
      }
      // In pencil mode, we clear the selection after drawing
      this.selectedNote = null;
      this.selectedNotes = [];
    } else {
      // In regular mode, if we were dragging notes, play the primary one and log the action
      if (this.isDragging && this.selectedNote) {
        // Play audio feedback of the primary selected note
        this.toneService.playNote(this.selectedNote.note, 0.5);

        // Check if we've actually moved any notes (in case of a simple click)
        if (this.selectedNotes.length === 1) {
          console.log(
            `Moved note to beat ${Math.floor(this.selectedNote.startTime) + 1} (${this.getNoteLabel(this.selectedNote.note)})`,
          );
        } else if (this.selectedNotes.length > 1) {
          console.log(`Moved ${this.selectedNotes.length} notes`);
        }
      }
      // In regular mode, we keep the selection
    }

    // Reset all interaction states
    this.isDrawing = false;
    this.isDragging = false;
    this.isSelecting = false;
    this.selectionBox = null;
  }

  // Toggle between regular and pencil mode
  toggleEditMode(): void {
    this.isPencilMode = !this.isPencilMode;
    console.log(`Switched to ${this.isPencilMode ? 'pencil' : 'regular'} mode`);

    // Clear selection when switching modes
    this.selectedNote = null;
    this.selectedNotes = [];
  }

  // Add a button to the UI to show debug info
  showDebugInfo(): void {
    if (!this.currentTrack) {
      console.log('No track selected');
      return;
    }

    console.log('Current Track:', {
      id: this.currentTrack.id,
      name: this.currentTrack.name,
      instrumentId: this.currentTrack.instrumentId,
      noteCount: this.currentTrack.notes.length,
    });

    console.log('Notes:');
    this.currentTrack.notes.forEach((note, index) => {
      console.log(`Note ${index}:`, {
        pitch: this.getNoteLabel(note.note),
        startTime: note.startTime,
        beat: Math.floor(note.startTime) + 1,
        duration: note.duration,
        velocity: note.velocity,
      });
    });
  }

  // Add a test pattern for debugging
  addTestPattern(): void {
    if (!this.currentTrack) {
      console.log('No track selected');
      return;
    }

    // Clear existing notes
    this.currentTrack.notes = [];

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

        this.currentTrack.notes.push(newNote);
      }
    }

    // Update the track
    this.trackService.updateTrack(this.currentTrack);
    console.log('Added test pattern with', this.currentTrack.notes.length, 'notes');

    // Show the debug info
    this.showDebugInfo();
  }

  // Handle double-click events (only in regular mode)
  handleDoubleClick(event: MouseEvent): void {
    // In pencil mode, single clicks already create notes, so no need to handle double-clicks
    if (this.isPencilMode) return;

    if (!this.currentTrack) return;

    const gridContainer = event.currentTarget as HTMLElement;
    const rect = gridContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top - 30; // Adjust for time indicators height

    // Calculate grid position
    const beatIndex = this.positionService.getBeatFromX(x);
    const noteIndex = this.positionService.getNoteIndexFromY(y);

    if (this.gridService.isWithinBounds(noteIndex, beatIndex, this.visibleNotes.length, this.totalBeats)) {
      // Get the note at this index in the sorted array
      const note = this.visibleNotes[noteIndex];

      // Check if a note already exists at this position
      const existingNote = this.findNoteAt(beatIndex, noteIndex);

      if (existingNote) {
        // If a note exists and we double-click it, delete it
        this.deleteNote(existingNote);

        // Clear any selection
        this.selectedNote = null;

        // Stop event propagation
        event.stopPropagation();
      } else {
        // Create a new note - ensure start time is an integer for clean beat boundaries
        const newNote: PianoRollNote = {
          note: { ...note },
          startTime: beatIndex, // Exact beat position (integer)
          duration: 1,
          velocity: 0.8,
        };

        this.currentTrack.notes.push(newNote);
        this.trackService.updateTrack(this.currentTrack);

        // Select the newly created note
        this.selectedNote = newNote;

        // Play the note as feedback - use low velocity for preview
        this.toneService.playNote(note, 0.5);

        console.log(`Created note at beat ${beatIndex + 1} (${this.getNoteLabel(note)})`);
      }
    }
  }

  handleResizeMove = (event: MouseEvent): void => {
    if (!this.isResizing || !this.selectedNote || !this.currentTrack) return;

    // Calculate the pixel difference in the horizontal direction
    const pixelDeltaX = event.clientX - this.dragStartPosition.x;

    // Only process if there's significant movement (more than 2 pixels)
    if (Math.abs(pixelDeltaX) > 2) {
      // Convert to beat units - use Math.round for more accurate grid snapping
      const deltaBeat = this.positionService.getBeatFromX(pixelDeltaX);

      if (deltaBeat !== 0) {
        // Store original duration for ratio calculation
        const originalDuration = this.selectedNote.duration;

        // Update primary note duration
        const newDuration = Math.max(1, originalDuration + deltaBeat);
        const maxDuration = this.totalBeats - this.selectedNote.startTime;
        this.selectedNote.duration = Math.min(newDuration, maxDuration);

        // Calculate resize ratio for other selected notes
        const resizeRatio = newDuration / originalDuration;

        // Update all other selected notes with the same resize ratio
        this.selectedNotes.forEach((note) => {
          if (note !== this.selectedNote) {
            // Store original duration
            const noteOriginalDuration = note.duration;

            // For other notes, calculate a scaled duration
            const scaledDuration = Math.max(1, Math.round(noteOriginalDuration * resizeRatio));
            // Ensure we don't go beyond the total beats
            const maxDur = this.totalBeats - note.startTime;
            note.duration = Math.min(scaledDuration, maxDur);
          }
        });

        // Update the track with all modified notes
        this.trackService.updateTrack(this.currentTrack);

        // Update drag start position based on the applied grid movements
        this.dragStartPosition.x += deltaBeat * this.cellWidth;
      }
    }
  };

  handleResizeEnd = (): void => {
    this.isResizing = false;

    // Clean up event listeners
    document.removeEventListener('mousemove', this.handleResizeMove);
    document.removeEventListener('mouseup', this.handleResizeEnd);
  };
}
