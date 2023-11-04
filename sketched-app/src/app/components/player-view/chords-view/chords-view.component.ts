import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ChordType } from 'src/app/enums/chord-type.enum';
import { Note } from 'src/app/models/note.model';
import { MusicService } from 'src/app/services/music.service';
import { ToneService } from 'src/app/services/tone.service';

@Component({
  selector: 'app-chords-view',
  templateUrl: './chords-view.component.html',
  styleUrls: ['./chords-view.component.scss'],
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
