import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavBarComponent } from '@components/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, NavBarComponent],
})
export class AppComponent {
  title = 'sketched-app';

  constructor() {}
}
