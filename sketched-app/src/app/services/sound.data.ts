import { Note } from '@models/note.model';
import { NoteName } from '@enums/note-name.enum';

// const semitoneRatio = 1.05946309436;
// const tuningFrequency = 440.0;

const getNextOctave = (note: Note): Note => ({
  position: note.position + 12,
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1,
});

const octave_negative_one: Note[] = [
  {
    position: 0,
    name: NoteName.C,
    frequency: 8.176,
    octave: -1,
  },
  {
    position: 1,
    name: NoteName.C_SHARP,
    frequency: 8.662,
    octave: -1,
  },
  {
    position: 2,
    name: NoteName.D,
    frequency: 9.177,
    octave: -1,
  },
  {
    position: 3,
    name: NoteName.D_SHARP,
    frequency: 9.723,
    octave: -1,
  },
  {
    position: 4,
    name: NoteName.E,
    frequency: 10.301,
    octave: -1,
  },
  {
    position: 5,
    name: NoteName.F,
    frequency: 10.913,
    octave: -1,
  },
  {
    position: 6,
    name: NoteName.F_SHARP,
    frequency: 11.562,
    octave: -1,
  },
  {
    position: 7,
    name: NoteName.G,
    frequency: 12.25,
    octave: -1,
  },
  {
    position: 8,
    name: NoteName.G_SHARP,
    frequency: 12.978,
    octave: -1,
  },
  {
    position: 9,
    name: NoteName.A,
    frequency: 13.75,
    octave: -1,
  },
  {
    position: 10,
    name: NoteName.A_SHARP,
    frequency: 14.568,
    octave: -1,
  },
  {
    position: 11,
    name: NoteName.B,
    frequency: 15.434,
    octave: -1,
  },
];

const octave_zero = octave_negative_one.map((note: Note) => getNextOctave(note));
const octave_one = octave_zero.map((note: Note) => getNextOctave(note));
const octave_two = octave_one.map((note: Note) => getNextOctave(note));
const octave_three = octave_two.map((note: Note) => getNextOctave(note));
const octave_four = octave_three.map((note: Note) => getNextOctave(note));
const octave_five = octave_four.map((note: Note) => getNextOctave(note));
const octave_six = octave_five.map((note: Note) => getNextOctave(note));
const octave_seven = octave_six.map((note: Note) => getNextOctave(note));
const octave_eight = octave_seven.map((note: Note) => getNextOctave(note));
const octave_nine = octave_eight.map((note: Note) => getNextOctave(note));

export const notes: Note[] = [
  ...octave_negative_one,
  ...octave_zero,
  ...octave_one,
  ...octave_two,
  ...octave_three,
  ...octave_four,
  ...octave_five,
  ...octave_six,
  ...octave_seven,
  ...octave_eight,
  ...octave_nine,
];
