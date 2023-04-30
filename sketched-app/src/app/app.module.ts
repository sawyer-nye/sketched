import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChordsViewComponent } from './components/player-view/chords-view/chords-view.component';
import { PlayerViewComponent } from './components/player-view/player-view.component';
import { OscillatorViewComponent } from './components/player-view/synth-view/synth-view.component';
import { DegreePipe } from './pipes/degree-pipe';
import { NotePipe } from './pipes/note-pipe';
import { AppRoutingModule } from './app-routing.module';
import { NavBarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    PlayerViewComponent,
    ChordsViewComponent,
    OscillatorViewComponent,
    NotePipe,
    DegreePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
