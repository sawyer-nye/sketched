import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Mode } from 'src/app/enums/mode-enum';
import { Note } from 'src/app/models/note.model';
import { NotePipe } from 'src/app/pipes/note-pipe';
import { MusicService } from 'src/app/services/music/music.service';
import { notes } from 'src/app/services/sound.data';
import { ToneService } from 'src/app/services/tone/tone.service';

@Component({
  standalone: true,
  imports: [CommonModule, NotePipe],
  templateUrl: './sketch-view.component.html',
})
export class SketchViewComponent {
  scaleNotes$: Observable<Note[]> = this.musicService.currentScale$;
  chords$: Observable<Note[][]> = this.musicService.currentChords$;

  scaleMode: Mode = Mode.IONIAN;
  modes: Mode[] = Object.values(Mode);
  notes: Note[] = notes;
  octaveThreeNotes: Note[] = notes.filter((note) => note.octave === 3);

  scaleRootNotePosition: number = 36;

  get scaleRootNote(): Note {
    return this.notes.find((note) => (note.position = this.scaleRootNotePosition))!;
  }

  constructor(private readonly musicService: MusicService, private readonly toneService: ToneService) {}
}
