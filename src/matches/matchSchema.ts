// import { discriminatedUnion, literal, number, object, string, union } from 'zod'
//
// const NameSchema = object({
//   full: string(),
//   short: string()
// })
//
// const PlayerNamesSchema = object({ top: NameSchema, bottom: NameSchema })
// const PlayerScoresSchema = object({ top: number(), bottom: number() })
//
// const StartEventSchema = object({
//   kind: literal('start'),
//   timestamp: string()
// })
//
// const ScoreEventSchema = object({
//   kind: literal('score'),
//   timestamp: string(),
//   score: PlayerScoresSchema
// })
//
// const DoubleEventSchema = object({
//   kind: literal('double'),
//   player: union([literal('top'), literal('bottom')]),
//   timestamp: string()
// })
// const TakeEventSchema = object({
//   kind: literal('take'),
//   player: union([literal('top'), literal('bottom')]),
//   timestamp: string()
// })
// const DropEventSchema = object({
//   kind: literal('drop'),
//   player: union([literal('top'), literal('bottom')]),
//   timestamp: string()
// })
// const WinEventSchema = object({
//   kind: literal('win'),
//   player: union([literal('top'), literal('bottom')]),
//   timestamp: string()
// })
//
// const GameEventSchema = discriminatedUnion('kind', [
//   StartEventSchema,
//   DoubleEventSchema,
//   TakeEventSchema,
//   DropEventSchema,
//   WinEventSchema,
//   ScoreEventSchema
// ])
//
// const GameSchema = object({
//   events: GameEventSchema.array()
// })
//
// export const MatchSchema = object({
//   id: string(),
//   url: string(),
//   stream: string(),
//   title: string(),
//   date: string(),
//   players: PlayerNamesSchema,
//   targetScore: number(),
//   games: GameSchema.array()
// })
