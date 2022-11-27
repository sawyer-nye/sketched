import { Component } from '@angular/core';
import { Note } from 'src/app/models/note.model';
import { notes } from 'src/app/services/sound/sound.data';
import { SoundService } from 'src/app/services/sound/sound.service';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
})
export class PlayerViewComponent {
  notes: Note[] = notes;

  constructor(private readonly soundService: SoundService) {}

  ngOnInit(): void {}

  playNote(note: Note) {
    this.soundService.playNote(note);
  }
}
