import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Mode } from 'src/app/enums/mode-enum';
import { Note } from 'src/app/models/note.model';
import { NotePipe } from 'src/app/pipes/note-pipe';
import { notes } from 'src/app/services/sound.data';
import { ToneService } from 'src/app/services/tone/tone.service';
import { ChordsViewComponent } from './chords-view/chords-view.component';
import { SynthViewComponent } from './synth-view/synth-view.component';
import { RootNoteSelectorComponent } from '../shared/root-note-selector/root-note-selector.component';
import { ScaleModeSelectorComponent } from '../shared/scale-mode-selector/scale-mode-selector.component';
import { MusicService } from 'src/app/services/music/music.service';

@Component({
  standalone: true,
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NotePipe,
    ChordsViewComponent,
    SynthViewComponent,
    RootNoteSelectorComponent,
    ScaleModeSelectorComponent,
  ],
})
export class PlayerViewComponent {
  scaleNotes$: Observable<Note[]> = this.musicService.currentScale$;
  chords$: Observable<Note[][]> = this.musicService.currentChords$;

  scaleMode: Mode = Mode.IONIAN;
  modes: Mode[] = Object.values(Mode);
  notes: Note[] = notes;
  octaveThreeNotes: Note[] = notes.filter((note) => note.octave === 3);

  constructor(private readonly musicService: MusicService, private readonly toneService: ToneService) {}

  playNote(note: Note): void {
    this.toneService.playNote(note);
  }
}
