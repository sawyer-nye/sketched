import { Note } from '@app/models/note.model';
import { notes } from '@app/services/sound.data';

export class MusicHelper {
  static getNoteFromMIDIPosition(position: number): Note {
    const note = notes[position];
    if (!note) throw Error(`note not found from midi position: ${position}`);

    return note;
  }
}
