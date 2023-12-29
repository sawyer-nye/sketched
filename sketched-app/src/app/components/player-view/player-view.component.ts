import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Note } from '@app/models/note.model';
import { NotePipe } from '@app/pipes/note-pipe';
import { notes } from '@app/services/sound.data';
import { ToneService } from '@app/services/tone/tone.service';
import { MusicService } from '@app/services/music/music.service';
import { ChordsViewComponent } from './chords-view/chords-view.component';
import { SynthViewComponent } from './synth-view/synth-view.component';
import { RootNoteSelectorComponent } from '@app/components/shared/root-note-selector/root-note-selector.component';
import { ScaleModeSelectorComponent } from '@app/components/shared/scale-mode-selector/scale-mode-selector.component';
import { NotesPlayerViewComponent } from './notes-player-view/notes-player.component';

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
    NotesPlayerViewComponent,
  ],
})
export class PlayerViewComponent {
  scaleNotes$: Observable<Note[]> = this.musicService.currentScale$;
  chords$: Observable<Note[][]> = this.musicService.currentChords$;

  notes: Note[] = notes;

  constructor(private readonly musicService: MusicService, private readonly toneService: ToneService) {}
}
