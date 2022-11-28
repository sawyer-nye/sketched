import { Component } from '@angular/core';
import { Chord } from 'src/app/enums/chord-enum';
import { Mode } from 'src/app/enums/mode-enum';
import { Note } from 'src/app/models/note.model';
import { MusicService } from 'src/app/services/music.service';
import { notes } from 'src/app/services/sound.data';
import { ToneService } from 'src/app/services/tone.service';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
})
export class PlayerViewComponent {
  scaleRootNotePosition: string = '63';
  scaleMode: Mode = Mode.IONIAN;
  modes: Mode[] = [];
  notes: Note[] = notes;
  octaveThreeNotes: Note[] = notes.filter((note) => note.octave === 3);
  scaleNotes: Note[] = [];

  chords: Note[][] = [];
  oneChord: Note[] = [];

  constructor(
    private readonly musicService: MusicService,
    private readonly toneService: ToneService
  ) {}

  ngOnInit(): void {
    this.modes = Object.values(Mode);
  }

  playNote(note: Note) {
    this.toneService.playNote(note);
  }

  updateScale(): void {
    this.scaleNotes = this.musicService.generateScale(
      Number(this.scaleRootNotePosition),
      this.scaleMode
    );
    this.updateChords();
  }

  updateChords(): void {;
    this.chords = [
      this.musicService.getChord(Chord.I, this.scaleNotes),
      this.musicService.getChord(Chord.II, this.scaleNotes),
      this.musicService.getChord(Chord.III, this.scaleNotes),
      this.musicService.getChord(Chord.IV, this.scaleNotes),
      this.musicService.getChord(Chord.V, this.scaleNotes),
      this.musicService.getChord(Chord.VI, this.scaleNotes),
      this.musicService.getChord(Chord.VII, this.scaleNotes),
    ];
  }

  playChord(notes: Note[]): void {
    this.toneService.playNotes(notes);
  }
}
