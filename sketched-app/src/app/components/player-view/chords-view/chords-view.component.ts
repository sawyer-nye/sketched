import { CommonModule, KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ChordType } from '@app/enums/chord-type.enum';
import { Note } from '@app/models/note.model';
import { ChordTypePipe } from '@app/pipes/chord-type-pipe';
import { DegreePipe } from '@app/pipes/degree-pipe';
import { NotePipe } from '@app/pipes/note-pipe';
import { MusicService } from '@app/services/music/music.service';
import { ToneService } from '@app/services/tone/tone.service';

@Component({
  standalone: true,
  selector: 'app-chords-view',
  templateUrl: './chords-view.component.html',
  styleUrls: ['./chords-view.component.scss'],
  imports: [CommonModule, ChordTypePipe, NotePipe, DegreePipe],
})
export class ChordsViewComponent {
  chords$: Observable<Note[][]> = this.musicService.currentChords$;
  allChords$: Observable<Record<ChordType, Note[][]> | null> = this.musicService.allChords$;

  ChordType = ChordType;

  constructor(private readonly musicService: MusicService, private readonly toneService: ToneService) {}

  playChord(notes: Note[]): void {
    this.toneService.playNotes(notes);
  }

  keepOriginalOrder(a: KeyValue<string, Note[][]>, b: KeyValue<string, Note[][]>): number {
    return 0;
  }
}
