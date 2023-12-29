import { CommonModule, KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ChordType } from 'src/app/enums/chord-type.enum';
import { Note } from 'src/app/models/note.model';
import { ChordTypePipe } from 'src/app/pipes/chord-type-pipe';
import { DegreePipe } from 'src/app/pipes/degree-pipe';
import { NotePipe } from 'src/app/pipes/note-pipe';
import { MusicService } from 'src/app/services/music/music.service';
import { ToneService } from 'src/app/services/tone/tone.service';

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
