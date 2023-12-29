import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mode } from '@app/enums/mode-enum';
import { MusicService } from '@app/services/music/music.service';

@Component({
  standalone: true,
  selector: 'app-scale-mode-selector',
  templateUrl: './scale-mode-selector.component.html',
  imports: [CommonModule, FormsModule],
})
export class ScaleModeSelectorComponent {
  scaleMode: Mode = this.musicService.currentScaleMode;
  modes: Mode[] = Object.values(Mode);

  constructor(private readonly musicService: MusicService) {}

  updateMode() {
    this.musicService.setCurrentScaleMode(this.scaleMode);
  }
}
