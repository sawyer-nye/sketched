import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MusicService } from '@services/music/music.service';
import { ToneService } from '@services/tone/tone.service';
import { RootNoteSelectorComponent } from '@components/shared/root-note-selector/root-note-selector.component';
import { ScaleModeSelectorComponent } from '@components/shared/scale-mode-selector/scale-mode-selector.component';

@Component({
  standalone: true,
  imports: [CommonModule, RootNoteSelectorComponent, ScaleModeSelectorComponent],
  templateUrl: './sketch-view.component.html',
})
export class SketchViewComponent {
  constructor(private readonly musicService: MusicService, private readonly toneService: ToneService) {}
}
