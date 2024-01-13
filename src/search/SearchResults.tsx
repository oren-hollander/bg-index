import { FC, useState } from 'react'
import { Game, GameEvent, Match } from './search.ts'
import { VideoPreview } from '../VideoPreview.tsx'

interface SearchResultProps {
  match: Match
  game: Game
  event: GameEvent
  onSelect(): void
}

const SearchResult: FC<SearchResultProps> = ({
  match,
  game,
  event,
  onSelect
}) => {
  const score = `${match.players.top}: ${game.startScore.top}, ${match.players.bottom}: ${game.startScore.bottom}`
  const getPlayerName = (player: 'top' | 'bottom') => {
    return match.players[player]
  }

  return (
    <div onClick={onSelect}>
      <span>{match.title}</span>
      <span>Score: {score}</span>
      <span>
        {getPlayerName(event.player)}: {event.kind}
      </span>
    </div>
  )
}

interface SearchResultsProps {
  matches: Match[]
}

export const SearchResults: FC<SearchResultsProps> = ({ matches }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match>()
  const [selectedEvent, setSelectedEvent] = useState<GameEvent>()

  const select = (match: Match, event: GameEvent) => {
    setSelectedMatch(match)
    setSelectedEvent(event)
  }

  return (
    <>
      {matches.flatMap(match =>
        match.games.flatMap(game =>
          game.events.map(event => (
            <SearchResult
              match={match}
              game={game}
              event={event}
              onSelect={() => select(match, event)}
            />
          ))
        )
      )}

      {selectedMatch && selectedEvent && (
        <VideoPreview
          url={selectedMatch.url}
          timestamp={selectedEvent.timestamp}
        />
      )}
    </>
  )
}
