import { Injectable } from '@angular/core';
import { MusicHelper } from '@app/services/music/music.helper';
import { ToneService } from '@app/services/tone/tone.service';

/** See:
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API
 *  - https://midi.org/summary-of-midi-1-0-messages
 *  - https://github.com/Tonejs/Midi */
@Injectable({ providedIn: 'root' })
export class MIDIService {
  private _midi: MIDIAccess | undefined;

  constructor(private readonly toneService: ToneService) {}

  async init(): Promise<void> {
    const midi = await this.getMIDIAccess();
    if (midi) {
      this._midi = midi;
      this.initializeMIDIListeners(midi);
    }
  }

  private async getMIDIAccess(): Promise<MIDIAccess | undefined> {
    const onMIDISuccess = (midiAccess: MIDIAccess) => {
      console.log('MIDI ready!');
      return midiAccess;
    };

    const onMIDIFailure = (msg: string) => {
      console.error(`Failed to get MIDI access - ${msg}`);
      return undefined;
    };

    return navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }

  private initializeMIDIListeners(midi: MIDIAccess): void {
    const onMIDIMessage = (event: MIDIMessageEvent) => {
      let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data?.length ?? 0} bytes]: `;
      for (const character of event.data ?? []) {
        str += `0x${character.toString(16)} `;
      }
      console.log(str);
    };

    midi.inputs.forEach((input: MIDIInput, _key: string, _parent: MIDIInputMap) => {
      input.onmidimessage = (event: MIDIMessageEvent) => {
        this.handleMIDIMessage(event);
      };
    });

    midi.onstatechange = (event: Event) => {
      console.log(`MIDI state changed: ${JSON.stringify(event)}`);
    };

    midi.inputs.forEach((entry: MIDIInput) => {
      entry.onmidimessage = onMIDIMessage;
    });
  }

  private handleMIDIMessage(message: MIDIMessageEvent) {
    console.log(`Received MIDI event: ${JSON.stringify(message)}`);
    const { command, channel, note, velocity } = this.parseMIDIMessage(message);

    const conforming_note = MusicHelper.getNoteFromMIDIPosition(note);

    // Stop command.
    // Negative velocity is an upward release rather than a downward press.
    if (command === 8) {
      // if (channel === 0) this.toneService.playMIDI(note, -velocity);
      // else if (channel === 9) onPad(note, -velocity);
    }

    // Start command.
    else if (command === 9) {
      if (channel === 0) this.toneService.playNote(conforming_note, velocity);
      // else if (channel === 9) onPad(note, velocity);
    }

    // Knob command.
    else if (command === 11) {
      // if (note === 1) onModWheel(velocity);
    }

    // Pitch bend command.
    else if (command === 14) {
      // onPitchBend(velocity);
    }
  }

  private parseMIDIMessage(message: MIDIMessageEvent) {
    if (message.data) {
      return {
        command: message.data[0] >> 4,
        channel: message.data[0] & 0xf,
        note: message.data[1],
        velocity: message.data[2] / 127,
      };
    }

    console.error('midi message with no data');
    throw Error('midi message with no data? should not happen');
  }
}
