import { FC, useState } from 'react'
import { Query, search } from './search.ts'
import { SearchResults } from './SearchResults.tsx'
import { matches } from './matches.ts'
import { Match } from '../matches/match.ts'

export const Search: FC = () => {
  const [title, setTitle] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [targetScore, setTargetScore] = useState<number | null>(null)

  const [searchResults, setSearchResults] = useState<Match[]>([])

  const performSearch = () => {
    const query: Query = {
      title: title === '' ? undefined : title,
      date:
        fromDate !== '' && toDate !== ''
          ? { from: new Date(fromDate), to: new Date(toDate) }
          : undefined,
      players:
        player1 !== '' && player2 !== ''
          ? [player1, player2]
          : player1 !== ''
            ? player1
            : player2 !== ''
              ? player2
              : undefined,

      targetScore: targetScore ?? undefined
    }
    setSearchResults(search(query, matches))
  }

  return (
    <>
      <div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
      </div>
      <div>
        Dates, {fromDate}
        <label>
          from:
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </label>
        <label>
          to:
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </label>
      </div>
      <div>
        Players:
        <input
          type="text"
          value={player1}
          onChange={e => setPlayer1(e.target.value)}
        />
        ,
        <input
          type="text"
          value={player2}
          onChange={e => setPlayer2(e.target.value)}
        />
      </div>
      <div>
        Target score:
        <input
          type="number"
          value={targetScore ?? ''}
          onChange={e => {
            const score = parseInt(e.target.value)
            if (!isNaN(score)) {
              setTargetScore(score)
            } else {
              setTargetScore(null)
            }
          }}
        />
      </div>
      <div>
        <button onClick={performSearch}>Search</button>
      </div>
      <div>
        <SearchResults matches={searchResults} />
      </div>
    </>
  )
}
