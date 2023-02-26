import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from 'src/app/models/note.model';
import { MusicService } from 'src/app/services/music.service';
import { ToneService } from 'src/app/services/tone.service';

@Component({
  selector: 'app-chords-view',
  templateUrl: './chords-view.component.html',
  styleUrls: ['./chords-view.component.scss'],
})
export class ChordsViewComponent {
  chords$: Observable<Note[][]> = this.musicService.currentChords$;

  constructor(
    private readonly musicService: MusicService,
    private readonly toneService: ToneService
  ) {}

  playChord(notes: Note[]): void {
    this.toneService.playNotes(notes);
  }
}
