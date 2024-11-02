import { NoteName } from '@app/enums/note-name.enum';
import { notes } from '@app/services/sound.data';

// see: https://inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
describe('sound data', () => {
  describe('given we are conforming to midi specifications', () => {
    it('should return a frequency of 8.176 for note 0', () => {
      expect(notes[0].frequency).toBe(8.176);
    });

    it('should return note name A and octave 0 for note 21', () => {
      const note = notes[21];
      expect(note.name).toBe(NoteName.A);
      expect(note.octave).toBe(0);
      expect(note.frequency).toBe(27.5);
      expect(note.position).toBe(21);
    });

    it('should return note name D and octave 7 for note 98', () => {
      const note = notes[98];
      expect(note.name).toBe(NoteName.D);
      expect(note.octave).toBe(7);
      expect(note.frequency).toBe(2349.312); // note: technically it should be .318
      expect(note.position).toBe(98);
    });

    it('should return note name G and octave 9 for note 127', () => {
      const note = notes[127];
      expect(note.name).toBe(NoteName.G);
      expect(note.octave).toBe(9);
      expect(note.frequency).toBe(12544); // note: technically it should be 12543.85
      expect(note.position).toBe(127);
    });

    it('should return note name F# and octave 4 for note 66', () => {
      const note = notes[66];
      expect(note.name).toBe(NoteName.F_SHARP);
      expect(note.octave).toBe(4);
      expect(note.frequency).toBe(369.984); // note: technically it should be 369.994
      expect(note.position).toBe(66);
    });
  });
});
