import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlayerViewComponent } from './components/player-view/player-view.component';
import { OscillatorViewComponent } from './components/player-view/synth-view/synth-view.component';
import { DegreePipe } from './pipes/degree-pipe';
import { NotePipe } from './pipes/note-pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlayerViewComponent,
    OscillatorViewComponent,
    NotePipe,
    DegreePipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
