import {
  record,
  union,
  literal,
  string,
  number,
  object,
  ZodType,
  TypeOf
} from 'zod'
import { readFile, writeFile } from 'fs/promises'
import { parse, stringify } from 'yaml'

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

const PlayerSchema = union([literal('top'), literal('bottom')])

const PlayersSchema = (t: ZodType) => record(PlayerSchema, t)
const PlayerNamesSchema = PlayersSchema(string())
const PlayerScoresSchema = PlayersSchema(number())

const GameEventSchema = object({
  kind: union([
    literal('start'),
    literal('double'),
    literal('take'),
    literal('drop'),
    literal('win')
  ]),
  player: union([literal('top'), literal('bottom')]),
  timestamp: string().transform(x => timestampToSeconds(x))
})

const GameSchema = object({
  startScore: PlayerScoresSchema,
  events: GameEventSchema.array()
})

const MatchSchema = object({
  url: string(),
  title: string(),
  date: string().transform(s => new Date(s)),
  players: PlayerNamesSchema,
  targetScore: number(),
  games: GameSchema.array()
})

export type Match = TypeOf<typeof MatchSchema>
export type PlayerNames = TypeOf<typeof PlayerNamesSchema>
type Game = TypeOf<typeof GameSchema>

export const match = (
  url: string,
  title: string,
  date: Date,
  players: PlayerNames,
  targetScore: number,
  games: Game[]
): Match => ({
  url,
  title,
  date,
  players,
  targetScore,
  games
})

export const loadFromFile = async (path: string): Promise<Match> => {
  const yaml = await readFile(path, 'utf-8')
  const json = parse(yaml)
  return MatchSchema.parse(json)
}

export const saveToFile = async (path: string, match: Match): Promise<void> => {
  const matchJson = {
    ...match,
    games: match.games.map(game => ({
      ...game,
      events: game.events.map(event => ({
        ...event,
        timestamp: secondsToTimestamp(event.timestamp)
      }))
    }))
  }
  await writeFile(path, stringify(matchJson), 'utf-8')
}
