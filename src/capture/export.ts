import {
  Game,
  GameEvent,
  Match,
  PlayerNames,
  PlayerScores
} from '../matches/match.ts'
import { v4 as uuid } from 'uuid'

export const exportMatch = (
  url: string,
  title: string,
  date: string,
  targetScore: number,
  scores: PlayerScores[],
  events: GameEvent[],
  players: PlayerNames
): Match => {
  const games: Game[] = []
  let startScore: PlayerScores | undefined = undefined
  let gameEvents: GameEvent[] = []

  for (const event of events) {
    gameEvents.push(event)

    switch (event.kind) {
      case 'start':
        startScore = scores.shift()!
        break
      case 'drop':
      case 'win':
        games.push({
          startScore: startScore!,
          events: gameEvents
        })
        gameEvents = []
        break
    }
  }

  return {
    id: uuid(),
    url,
    title,
    date,
    players,
    targetScore,
    games
  }
}
