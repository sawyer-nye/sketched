import { Component, OnInit } from '@angular/core';
import { SoundService } from './services/sound/sound.service';
import { NoteName } from './enums/note-name.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'sketched-app';

  constructor(private readonly soundService: SoundService) {}

  ngOnInit(): void {
    this.soundService.init();
  }

  playNote(): void {
    const note = {
      name: NoteName.C,
      frequency: 130.8,
      octave: 3,
    };
    this.soundService.playNote(note);
  }
}
