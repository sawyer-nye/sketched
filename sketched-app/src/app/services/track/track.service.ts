import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { InstrumentType, PianoRollNote, Track } from '@models/piano-roll-note.model';
import { SequencerService, TickType } from '@services/sequencer/sequencer.service';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private readonly _tracks = new BehaviorSubject<Track[]>([]);
  private readonly _currentTrackId = new BehaviorSubject<string | null>(null);

  readonly tracks$: Observable<Track[]> = this._tracks.asObservable();
  readonly currentTrackId$: Observable<string | null> = this._currentTrackId.asObservable();
  readonly currentTrack$: Observable<Track | null> = combineLatest([this.tracks$, this.currentTrackId$]).pipe(
    map(([tracks, currentTrackId]) => tracks.find((track) => track.id === currentTrackId) || null),
  );

  constructor(private sequencerService: SequencerService) {
    // Initialize with a default track
    // this.createTrack();
  }

  get tracks(): Track[] {
    return this._tracks.getValue();
  }

  get currentTrackId(): string | null {
    return this._currentTrackId.getValue();
  }

  set currentTrackId(trackId: string | null) {
    this._currentTrackId.next(trackId);
  }

  createTrack(name: string = 'New Track'): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name,
      notes: [],
      instrumentType: InstrumentType.MONO_SYNTH,
      isMuted: false,
      isSolo: false,
      volume: 0.8,
    };

    this._tracks.next([...this.tracks, newTrack]);

    // If no current track is selected, select this one
    if (this.getCurrentTrack() === null) {
      this.currentTrackId = newTrack.id;
    }

    return newTrack;
  }

  removeTrack(trackId: string): void {
    const filteredTracks = this.tracks.filter((track) => track.id !== trackId);
    this._tracks.next(filteredTracks);

    // If we removed the current track, select a new one if available
    if (this.currentTrackId === trackId) {
      this.currentTrackId = filteredTracks.length > 0 ? filteredTracks[0].id : null;
    }
  }

  setCurrentTrack(trackId: string): void {
    const track = this.tracks.find((track) => track.id === trackId) || null;
    this.currentTrackId = track?.id || null;
  }

  getCurrentTrack(): Track | null {
    const trackId = this.currentTrackId;
    if (!trackId) return null;

    return this.tracks.find((track) => track.id === trackId) || null;
  }

  addNote(note: PianoRollNote): void {
    const currentTrack = this.getCurrentTrack();

    if (!currentTrack) return;

    this.updateTrack({
      ...currentTrack,
      notes: [...currentTrack.notes, note],
    });
  }

  clearNotes(): void {
    const currentTrack = this.getCurrentTrack();

    if (!currentTrack) return;

    this.updateTrack({
      ...currentTrack,
      notes: [],
    });
  }

  deleteNote(note: PianoRollNote): void {
    const currentTrack = this.getCurrentTrack();

    if (!currentTrack) return;

    this.updateTrack({
      ...currentTrack,
      notes: currentTrack.notes.filter((n) => n !== note),
    });
  }

  updateTrack(updatedTrack: Track): void {
    const updatedTracks = this.tracks.map((track) => (track.id === updatedTrack.id ? updatedTrack : track));

    this._tracks.next(updatedTracks);
  }

  // Register all notes from all tracks with the sequencer for playback
  registerAllTracksForPlayback(): void {
    // First, clear any previously registered hits to avoid duplicates
    this.deregisterAllTracksFromPlayback();

    this.tracks.forEach((track) => {
      if (track.isMuted) return;

      // Get all unique beat positions where notes start
      const uniqueBeats = new Set<number>();
      track.notes.forEach((note) => {
        uniqueBeats.add(Math.floor(note.startTime) + 1); // Convert to 1-based beats
      });

      // Register a hit for each unique beat position
      Array.from(uniqueBeats).forEach((beat) => {
        this.sequencerService.registerHit(
          beat,
          track.id, // Use track ID to identify the track
          TickType.QUARTER,
        );
      });
    });

    console.log('Registered all tracks for playback');
  }

  // Deregister all notes from all tracks
  deregisterAllTracksFromPlayback(): void {
    this.tracks.forEach((track) => {
      // Get all unique beat positions where notes start
      const uniqueBeats = new Set<number>();
      track.notes.forEach((note) => {
        uniqueBeats.add(Math.floor(note.startTime) + 1);
      });

      // Deregister each unique beat
      Array.from(uniqueBeats).forEach((beat) => {
        this.sequencerService.deregisterHit(beat, track.id);
      });
    });

    console.log('Deregistered all tracks from playback');
  }
}
