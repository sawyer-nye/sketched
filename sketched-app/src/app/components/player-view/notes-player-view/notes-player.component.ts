import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from '@models/note.model';
import { NotePipe } from '@pipes/note-pipe';
import { MusicService } from '@services/music/music.service';
import { notes } from '@services/sound.data';
import { ToneService } from '@services/tone/tone.service';

@Component({
  standalone: true,
  selector: 'app-notes-player-view',
  imports: [CommonModule, NotePipe],
  templateUrl: './notes-player.component.html',
  styleUrls: ['./notes-player.component.scss'],
})
export class NotesPlayerViewComponent {
  scaleNotes$: Observable<Note[]> = this.musicService.currentScale$;
  chords$: Observable<Note[][]> = this.musicService.currentChords$;

  notes: Note[] = notes;

  constructor(
    private readonly musicService: MusicService,
    private readonly toneService: ToneService,
  ) {}

  playNote(note: Note) {
    this.toneService.playNote(note);
  }
}
