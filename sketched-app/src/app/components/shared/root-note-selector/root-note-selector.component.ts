import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteName } from '@app/enums/note-name.enum';
import { Note } from '@app/models/note.model';
import { NotePipe } from '@app/pipes/note-pipe';
import { MusicService } from '@app/services/music/music.service';
import { notes } from '@app/services/sound.data';

@Component({
  standalone: true,
  selector: 'app-root-note-selector',
  imports: [CommonModule, NotePipe, FormsModule],
  templateUrl: './root-note-selector.component.html',
  styleUrls: ['./root-note-selector.component.scss'],
})
export class RootNoteSelectorComponent {
  rootNoteName: NoteName = this.musicService.currentRootNote.name;
  octaveThreeNotes: Note[] = notes.filter((note) => note.octave === 3);

  constructor(private readonly musicService: MusicService) {}

  updateRootNote(): void {
    this.musicService.setCurrentRootNote(this.octaveThreeNotes.find((note) => note.name === this.rootNoteName)!);
  }
}
