import { Game, GameEvent, NewMatch, PlayerNames } from '../matches/match.ts'

export const getExportedMatch = (
  url: string,
  stream: string,
  title: string,
  date: string,
  targetScore: number,
  events: GameEvent[],
  players: PlayerNames
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
    url,
    title,
    stream,
    date,
    players,
    targetScore,
    games
  }
}
