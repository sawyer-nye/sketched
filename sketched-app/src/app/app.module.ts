import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlayerViewComponent } from './components/player-view/player-view.component';
import { OscillatorViewComponent } from './components/player-view/synth-view/synth-view.component';
import { NotePipe } from './pipes/note-pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlayerViewComponent,
    OscillatorViewComponent,
    NotePipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
