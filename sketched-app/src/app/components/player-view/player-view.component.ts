import { Component } from '@angular/core';
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
  scaleMode: string = 'aeolian';
  notes: Note[] = notes;
  octaveThreeNotes: Note[] = notes.filter((note) => note.octave === 3);
  scaleNotes: Note[] = [];

  constructor(
    private readonly musicService: MusicService,
    private readonly toneService: ToneService
  ) {}

  ngOnInit(): void {}

  playNote(note: Note) {
    this.toneService.playNote(note);
  }

  updateScale(): void {
    this.scaleNotes = this.musicService.generateScale(
      Number(this.scaleRootNotePosition),
      this.scaleMode
    );
  }
}
