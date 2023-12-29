import { Routes } from '@angular/router';
import { PlayerViewComponent } from '@components/player-view/player-view.component';
import { PianoRollViewComponent } from '@components/piano-roll/piano-roll-view.component';
import { SketchViewComponent } from '@components/sketch/sketch-view.component';

export const routes: Routes = [
  { path: '', component: PlayerViewComponent },
  { path: 'piano-roll', component: PianoRollViewComponent },
  { path: 'sketch', component: SketchViewComponent },
];
