import { isEqual } from 'lodash/fp'
import { isString } from 'lodash'
import { Match, PlayerNames } from '../matches/match.ts'

export type FieldMatcher<FieldType, QueryType = FieldType> = (
  field: FieldType,
  query: QueryType
) => boolean

export type QueryMatcher<FieldType, QueryType = FieldType> = (
  field: FieldType,
  query: QueryType | undefined
) => boolean

const makeQueryMatcher =
  <F, Q = F>(matcher: FieldMatcher<F, Q>): QueryMatcher<F, Q> =>
  (field: F, query: Q | undefined) => {
    if (query === undefined) {
      return true
    } else {
      return matcher(field, query)
    }
  }

export const textMatcher = makeQueryMatcher<string>((text, query) =>
  text.toLowerCase().includes(query.toLowerCase())
)

interface DateQuery {
  from: Date
  to: Date
}

export const dateMatcher = makeQueryMatcher<Date, DateQuery>(
  (date, { from, to }) => date >= from && date <= to
)

export const playerMatcher = makeQueryMatcher<PlayerNames, string>(
  (players, query) => players.top === query || players.bottom.includes(query)
)

export const playersMatcher = makeQueryMatcher<PlayerNames, [string, string]>(
  (players, query) =>
    isEqual(players, { top: query[0], bottom: query[1] }) ||
    isEqual(players, { top: query[1], bottom: query[0] })
)

export const numericMatcher = makeQueryMatcher<number>(
  (number, query) => number === query
)

export interface Query {
  title?: string
  date?: DateQuery
  players?: [string, string] | string
  targetScore?: number
}

export const search = (query: Query, entries: Match[]): Match[] => {
  const results: Match[] = []

  for (const entry of entries) {
    const titleMatched = textMatcher(entry.title, query.title)
    const dateMatched = dateMatcher(entry.date, query.date)

    const playersMatched = isString(query.players)
      ? playerMatcher(entry.players, query.players)
      : playersMatcher(entry.players, query.players)

    const targetScoreMatched = numericMatcher(
      entry.targetScore,
      query.targetScore
    )

    if (titleMatched && dateMatched && playersMatched && targetScoreMatched) {
      results.push(entry)
    }
  }

  return results
}
