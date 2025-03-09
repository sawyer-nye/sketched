import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Track } from '@models/piano-roll-note.model';
import { SequencerService, TickType } from '@services/sequencer/sequencer.service';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private readonly _tracks = new BehaviorSubject<Track[]>([]);
  private readonly _currentTrack = new BehaviorSubject<Track | null>(null);

  readonly tracks$: Observable<Track[]> = this._tracks.asObservable();
  readonly currentTrack$: Observable<Track | null> = this._currentTrack.asObservable();

  constructor(private sequencerService: SequencerService) {
    // Initialize with a default track
    this.createTrack();
  }

  get tracks(): Track[] {
    return this._tracks.getValue();
  }

  get currentTrack(): Track | null {
    return this._currentTrack.getValue();
  }

  createTrack(name: string = 'New Track'): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name,
      notes: [],
      instrumentId: 'monosynth',
      isMuted: false,
      isSolo: false,
      volume: 0.8,
    };

    this._tracks.next([...this.tracks, newTrack]);

    // If no current track is selected, select this one
    if (this.currentTrack === null) {
      this._currentTrack.next(newTrack);
    }

    return newTrack;
  }

  removeTrack(trackId: string): void {
    const filteredTracks = this.tracks.filter((track) => track.id !== trackId);
    this._tracks.next(filteredTracks);

    // If we removed the current track, select a new one if available
    if (this.currentTrack?.id === trackId) {
      this._currentTrack.next(filteredTracks.length > 0 ? filteredTracks[0] : null);
    }
  }

  setCurrentTrack(trackId: string): void {
    const track = this.tracks.find((track) => track.id === trackId) || null;
    this._currentTrack.next(track);
  }

  getCurrentTrack(): Track | null {
    const trackId = this.currentTrack?.id;
    if (!trackId) return null;

    return this.tracks.find((track) => track.id === trackId) || null;
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
      track.notes.forEach(note => {
        uniqueBeats.add(Math.floor(note.startTime) + 1); // Convert to 1-based beats
      });
      
      // Register a hit for each unique beat position
      Array.from(uniqueBeats).forEach(beat => {
        this.sequencerService.registerHit(
          beat,
          track.id, // Use track ID to identify the track
          TickType.QUARTER
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
