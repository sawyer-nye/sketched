import { Component } from '@angular/core';
import { NoteName } from 'src/app/enums/note-name.enum';
import { Note } from 'src/app/models/note.model';
import { notes } from 'src/app/services/sound/sound.data';
import { ToneService } from 'src/app/services/tone/tone.service';

@Component({
  selector: 'app-player-view',
  templateUrl: './player-view.component.html',
  styleUrls: ['./player-view.component.scss'],
})
export class PlayerViewComponent {
  scaleRootNote: NoteName = NoteName.C;
  notes: Note[] = notes;
  octaveThreeNotes: Note[] = notes.filter(note => note.octave === 3);

  constructor(private readonly toneService: ToneService) {}

  ngOnInit(): void {}

  playNote(note: Note) {
    this.toneService.playNote(note);
  }
}
