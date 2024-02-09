import { literal, number, object, string, union } from 'zod'

const NameSchema = object({
  full: string(),
  short: string()
})

const PlayerNamesSchema = object({ top: NameSchema, bottom: NameSchema })
const PlayerScoresSchema = object({ top: number(), bottom: number() })

const GameEventSchema = object({
  kind: union([
    literal('start'),
    literal('double'),
    literal('take'),
    literal('drop'),
    literal('win')
  ]),
  player: union([literal('top'), literal('bottom')]),
  timestamp: string()
})

const GameSchema = object({
  startScore: PlayerScoresSchema,
  events: GameEventSchema.array()
})

export const MatchSchema = object({
  id: string(),
  url: string(),
  title: string(),
  date: string(),
  players: PlayerNamesSchema,
  targetScore: number(),
  games: GameSchema.array()
})
