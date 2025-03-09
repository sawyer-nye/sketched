import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PianoRollStateService {
  private readonly _isPencilMode = new BehaviorSubject<boolean>(false);
  readonly isPencilMode$ = this._isPencilMode.asObservable();

  toggleIsPencilMode() {
    this._isPencilMode.next(!this._isPencilMode.value);
  }

  get isPencilMode() {
    return this._isPencilMode.value;
  }
}
