import { Game, GameEvent, NewMatch, PlayerIds } from '../services/match.ts'
import { Stream } from '../services/stream.ts'

export const getExportedMatch = (
  stream: Stream,
  title: string,
  targetScore: number,
  events: GameEvent[],
  playerIds: PlayerIds
): NewMatch => {
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
    title,
    streamId: stream._id,
    playerIds,
    targetScore,
    games
  }
}
