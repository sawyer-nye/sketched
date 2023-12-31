import { APP_BASE_HREF } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { routes } from '@app/app-routes';
import { environment } from 'src/environments/environment';

bootstrapApplication(AppComponent, {
  providers: [provideRouter([...routes]), { provide: APP_BASE_HREF, useValue: environment.baseHref }],
});
