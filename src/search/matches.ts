import { match, Match } from './search.ts'

const seconds = (time: string): number => {
  const parts = time.split(':')
  switch (parts.length) {
    case 1:
      return parseInt(parts[0])
    case 2:
      return parseInt(parts[0]) * 60 + parseInt(parts[1])
    case 3:
      return (
        parseInt(parts[0]) * 60 * 60 +
        parseInt(parts[1]) * 60 +
        parseInt(parts[2])
      )
    default:
      throw new Error(`Invalid time format: ${time}`)
  }
}

export const matches: Match[] = [
  match(
    'https://youtu.be/8B6cJAGALuE?',
    'UBC 2023 Final, Day 1, Match 1',
    new Date('2023-12-18'),
    { top: 'Masayuki "Mochy" Mochizuki', bottom: 'Sander Lylloff' },
    7,
    [
      {
        startScore: { top: 0, bottom: 0 },
        events: [
          { kind: 'start', player: 'top', timestamp: seconds('8:23') },
          { kind: 'double', player: 'top', timestamp: seconds('13:13') },
          { kind: 'take', player: 'bottom', timestamp: seconds('13:28') },
          { kind: 'double', player: 'bottom', timestamp: seconds('17:05') },
          { kind: 'take', player: 'top', timestamp: seconds('17:47') },
          { kind: 'win', player: 'bottom', timestamp: seconds('3022') }
        ]
      },
      {
        startScore: { top: 0, bottom: 4 },
        events: [
          { kind: 'start', player: 'bottom', timestamp: seconds('30:52') },
          { kind: 'double', player: 'top', timestamp: seconds('36:20') },
          { kind: 'take', player: 'bottom', timestamp: seconds('36:32') },
          { kind: 'win', player: 'top', timestamp: seconds('43:02') }
        ]
      },
      {
        startScore: { top: 2, bottom: 4 },
        events: [
          { kind: 'start', player: 'bottom', timestamp: seconds('43:46') },
          { kind: 'double', player: 'top', timestamp: seconds('50:01') },
          { kind: 'take', player: 'bottom', timestamp: seconds('50:04') },
          { kind: 'win', player: 'top', timestamp: seconds('1:09:05') }
        ]
      },
      {
        startScore: { top: 4, bottom: 4 },
        events: [
          { kind: 'start', player: 'bottom', timestamp: seconds('1:09:39') },
          { kind: 'double', player: 'top', timestamp: seconds('1:13:20') },
          { kind: 'drop', player: 'bottom', timestamp: seconds('1:13:23') }
        ]
      },
      {
        startScore: { top: 5, bottom: 4 },
        events: [
          { kind: 'start', player: 'top', timestamp: seconds('1:13:42') },
          { kind: 'double', player: 'bottom', timestamp: seconds('1:15:05') },
          { kind: 'drop', player: 'top', timestamp: seconds('1:15:21') }
        ]
      },
      {
        startScore: { top: 5, bottom: 5 },
        events: [
          { kind: 'start', player: 'bottom', timestamp: seconds('1:15:37') },
          { kind: 'double', player: 'top', timestamp: seconds('1:17:18') },
          { kind: 'take', player: 'bottom', timestamp: seconds('1:17:19') },
          { kind: 'win', player: 'bottom', timestamp: seconds('1:25:16') }
        ]
      }
    ]
  ),
  match(
    'https://youtu.be/8B6cJAGALuE?',
    'UBC 2023 Final, Day 1, Match 2',
    new Date('2023-12-18'),
    { top: 'Masayuki "Mochy" Mochizuki', bottom: 'Sander Lylloff' },
    7,
    [
      {
        startScore: { top: 0, bottom: 0 },
        events: [
          { kind: 'start', player: 'top', timestamp: seconds('1:58:23') },
          { kind: 'double', player: 'bottom', timestamp: seconds('2:04:46') },
          { kind: 'take', player: 'top', timestamp: seconds('2:04:46') },
          { kind: 'win', player: 'bottom', timestamp: seconds('2:16:56') }
        ]
      },
      {
        startScore: { top: 0, bottom: 2 },
        events: [
          { kind: 'start', player: 'top', timestamp: seconds('1:58:23') },
          { kind: 'double', player: 'bottom', timestamp: seconds('2:04:46') },
          { kind: 'take', player: 'top', timestamp: seconds('2:04:46') },
          { kind: 'win', player: 'bottom', timestamp: seconds('2:16:56') }
        ]
      }
    ]
  )
]
