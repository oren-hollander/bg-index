import { BSON } from 'realm-web'
import ObjectId = BSON.ObjectId
import { Player } from './player.ts'
import { WithId } from './crud.ts'

export function secondsToTimestamp(seconds: number): string {
  if (seconds < 60) {
    return seconds.toString()
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const sec = Math.floor(seconds % 60)

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

export interface Players {
  top: Player
  bottom: Player
}

export interface PlayerIds {
  top: ObjectId
  bottom: ObjectId
}

export interface PlayerScores {
  top: number
  bottom: number
}

export interface StartEvent {
  kind: 'start'
  timestamp: string
}

export interface ScoreEvent {
  kind: 'score'
  timestamp: string
  score: PlayerScores
}

export interface PlayerEvent {
  kind: 'double' | 'take' | 'drop' | 'win'
  timestamp: string
  player: 'top' | 'bottom'
}

export type GameEvent = StartEvent | PlayerEvent | ScoreEvent

export type EventKind = GameEvent['kind']

export interface Game {
  events: GameEvent[]
}

export interface NewMatch {
  streamId: ObjectId
  title: string
  playerIds: PlayerIds
  targetScore: number
  games: Game[]
}

export type Match = WithId<NewMatch>
