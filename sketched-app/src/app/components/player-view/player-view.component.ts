import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
export class PlayerViewComponent implements OnInit {
  scaleNotes$: Observable<Note[]> = this.musicService.currentScale$;
  chords$: Observable<Note[][]> = this.musicService.currentChords$;

  scaleMode: Mode = Mode.IONIAN;
  modes: Mode[] = Object.values(Mode);
  notes: Note[] = notes;
  octaveThreeNotes: Note[] = notes.filter((note) => note.octave === 3);

  scaleRootNotePosition: number = 36;

  constructor(private readonly musicService: MusicService, private readonly toneService: ToneService) {}

  ngOnInit(): void {
    this.updateScale();
  }

  playNote(note: Note): void {
    this.toneService.playNote(note);
  }

  updateScale(): void {
    this.musicService.setScale(
      Number(this.scaleRootNotePosition),
      this.scaleMode
    );
  }
}
