import { Game, GameEvent } from '../services/match.ts'

export const getGames = (events: GameEvent[]): Game[] => {
  const games: Game[] = []
  let gameEvents: GameEvent[] = []

  for (const event of events) {
    if (event.kind === 'start' && gameEvents.length > 0) {
      games.push({
        events: gameEvents
      })
      gameEvents = []
    }
    gameEvents.push(event)
  }

  if (gameEvents.length > 0) {
    games.push({
      events: gameEvents
    })
  }

  return games
}

export const getGameEvents = (games: Game[]): GameEvent[] => {
  return games.flatMap(game => game.events)
}
