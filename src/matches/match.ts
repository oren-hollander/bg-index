export function secondsToTimestamp(seconds: number): string {
  if (seconds < 60) {
    return seconds.toString()
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const sec = seconds % 60

  let timeString = ''

  if (hours > 0) {
    timeString += `${hours}:`
  }

  if (hours > 0 && minutes < 10) {
    timeString += `0${minutes}`
  } else {
    timeString += `${minutes}`
  }

  if (sec < 10) {
    timeString += `:0${sec}`
  } else {
    timeString += `:${sec}`
  }

  return timeString
}

export const timestampToSeconds = (time: string): number => {
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

export type Players<T> = Record<'top' | 'bottom', T>

export interface Name {
  full: string
  short: string
}

export interface PlayerNames {
  top: Name
  bottom: Name
}

interface PlayerScores {
  top: number
  bottom: number
}

export interface Game {
  startScore: PlayerScores
  events: GameEvent[]
}

export type EventKind = 'start' | 'double' | 'take' | 'drop' | 'win'
export interface GameEvent {
  kind: EventKind
  player: 'top' | 'bottom'
  timestamp: string
}

export interface Match {
  id: string
  url: string
  title: string
  date: string
  players: PlayerNames
  targetScore: number
  games: Game[]
}
