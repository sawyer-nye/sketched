import { Note } from 'src/app/models/note.model';
import { NoteName } from 'src/app/enums/note-name.enum';

const semitoneRatio = 1.05946309436;
const tuningFrequency = 440.0;

const octave_zero = [
  {
    name: NoteName.C,
    frequency: 16.35,
    octave: 0
  },
  {
    name: NoteName.C_SHARP,
    frequency: 17.32,
    octave: 0
  },
  {
    name: NoteName.D,
    frequency: 18.35,
    octave: 0
  },
  {
    name: NoteName.D_SHARP,
    frequency: 19.45,
    octave: 0
  },
  {
    name: NoteName.E,
    frequency: 20.60,
    octave: 0
  },
  {
    name: NoteName.F,
    frequency: 21.83,
    octave: 0
  },
  {
    name: NoteName.F_SHARP,
    frequency: 23.12,
    octave: 0
  },
  {
    name: NoteName.G,
    frequency: 24.50,
    octave: 0
  },
  {
    name: NoteName.G_SHARP,
    frequency: 25.96,
    octave: 0
  },
  {
    name: NoteName.A,
    frequency: 27.50,
    octave: 0
  },
  {
    name: NoteName.A_SHARP,
    frequency: 29.14,
    octave: 0
  },
  {
    name: NoteName.B,
    frequency: 30.87,
    octave: 0
  },
];

const octave_one = octave_zero.map((note: Note) => ({
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1
}));

const octave_two = octave_one.map((note: Note) => ({
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1
}));

const octave_three = octave_two.map((note: Note) => ({
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1
}));

const octave_four = octave_three.map((note: Note) => ({
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1
}));

const octave_five = octave_four.map((note: Note) => ({
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1
}));

const octave_six = octave_five.map((note: Note) => ({
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1
}));

const octave_seven = octave_six.map((note: Note) => ({
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1
}));

const octave_eight = octave_seven.map((note: Note) => ({
  name: note.name,
  frequency: note.frequency * 2.0,
  octave: note.octave + 1
}));

export const notes: Note[] = [
  ...octave_zero,
  ...octave_one,
  ...octave_two,
  ...octave_three,
  ...octave_four,
  ...octave_five,
  ...octave_six,
  ...octave_seven,
  ...octave_eight
];