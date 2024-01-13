import { compact } from 'lodash/fp'

export type Kind =
  | 'stream'
  | 'match'
  | 'matchScore'
  | 'game'
  | 'score'
  | 'player'
  | 'dice'

export type Keywords = Partial<Record<Kind, string[]>>

export const parseQuery = (query: string): Keywords => {
  const keywords = compact(query.split(';'))
  const kv = keywords.map(keyword => {
    const [key, value] = keyword.split(':')
    const values = value.split(',')
    return [key, values] as [Kind, string[]]
  })

  return Object.fromEntries(kv) as Keywords
}

export interface Clip {
  url: string
  timestamp: number
  keywords: Keywords
}

export const Clip = (
  url: string,
  timestamp: number,
  keywords: Keywords
): Clip => ({ url, timestamp, keywords })

export class VideoIndex {
  constructor(private readonly clips: Clip[]) {}

  private match(query: Keywords, clip: Keywords): boolean {
    for (const key of Object.keys(query) as Kind[]) {
      const queryValues = query[key]
      const clipValues = clip[key]

      if (queryValues && clipValues) {
        const match = queryValues.some(queryValue =>
          clipValues.find(clipValue => {
            return clipValue.includes(queryValue)
          })
        )
        if (match) {
          return true
        }
      }
    }
    return false
  }

  search(query: string): Clip[] {
    const queryKeywords = parseQuery(query)
    return this.clips.filter(clip => this.match(queryKeywords, clip.keywords))
  }
}
