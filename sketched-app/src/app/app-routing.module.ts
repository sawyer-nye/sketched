import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerViewComponent } from './components/player-view/player-view.component';

const routes: Routes = [{ path: '', component: PlayerViewComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
