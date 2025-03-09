import { Note } from '@app/models/note.model';
import { Subscription } from 'rxjs';

export interface GridRow {
  note: Note;
  cells: Array<{ beat: number }>;
}

export interface HitSubscription {
  trackId: string;
  onTick: number;
  subscription: Subscription;
}

export interface SelectionBox {
  startX: number;
  startY: number;
  width: number;
  height: number;
}
