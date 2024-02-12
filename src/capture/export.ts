import { Game, GameEvent, Match, PlayerNames } from '../matches/match.ts'
import { BSON } from 'realm-web'

export const getExportedMatch = (
  url: string,
  stream: string,
  title: string,
  date: string,
  targetScore: number,
  events: GameEvent[],
  players: PlayerNames
): Match => {
  const games: Game[] = []
  let gameEvents: GameEvent[] = []

  for (const event of events) {
    gameEvents.push(event)
    switch (event.kind) {
      case 'score':
        games.push({
          events: gameEvents
        })
        gameEvents = []
        break
    }
  }

  return {
    _id: new BSON.ObjectId(),
    url,
    title,
    stream,
    date,
    players,
    targetScore,
    games
  }
}
