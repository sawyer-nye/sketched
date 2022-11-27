import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlayerViewComponent } from './components/player-view/player-view.component';
import { OscillatorViewComponent } from './components/player-view/oscillator-view/oscillator-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerViewComponent,
    OscillatorViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
