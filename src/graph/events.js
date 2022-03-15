import { sleep } from '../utils';

const totalEvents = [
  {
    // this object will be "parsed" into an Event Object
    allDay: false,
    timezone: 'local',
    title: 'The Titl', // a property!
    start: '2022-03-08T10:00:00', // a property!
    end: '2022-03-08T12:00:00', // a property! ** see important note below about 'end' **
    extendedProps: {
      id: 0,
      a: 10,
      b: 20,
    },
  },
  {
    // this object will be "parsed" into an Event Object
    allDay: false,
    timezone: 'local',
    title: 'The Titl', // a property!
    start: '2022-03-14T10:00:00', // a property!
    end: '2022-03-14T12:00:00', // a property! ** see important note below about 'end' **
    extendedProps: {
      id: 1,
      a: 10,
      b: 20,
    },
  },
  {
    // this object will be "parsed" into an Event Object
    allDay: false,
    timezone: 'local',
    title: 'The Titl', // a property!
    start: '2022-03-14T11:00:00', // a property!
    end: '2022-03-14T14:00:00', // a property! ** see important note below about 'end' **
    extendedProps: {
      id: 2,
      a: 30,
      b: 40,
    },
  },
];

export const fetchEvents = async (range) => {
  await sleep(100);
  return totalEvents.filter(
    ({ start }) => start >= range.start.toISOString() && start <= range.end.toISOString()
  );
};
