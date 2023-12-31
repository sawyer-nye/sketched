import { Injectable } from '@angular/core';
import { BehaviorSubject, NEVER } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TriggerBusService {
  private readonly _ = new BehaviorSubject<any>(NEVER);
}
