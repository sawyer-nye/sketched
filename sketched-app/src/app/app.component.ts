import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MIDIService } from '@app/services/midi/midi.service';

import { NavBarComponent } from '@components/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, NavBarComponent],
})
export class AppComponent implements OnInit {
  title = 'sketched-app';

  constructor(private readonly midiService: MIDIService) {}

  ngOnInit() {
    void this.midiService.init();
  }
}
