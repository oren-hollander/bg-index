import { test, expect, describe } from 'vitest'
import { search } from './search'
import { Match } from '../matches/match.ts'
import { BSON } from 'realm-web'

const match1: Match = {
  _id: new BSON.ObjectId(),
  url: 'https://example.com/clip1',
  stream: 'Stream 1',
  title: 'NY Open',
  date: '2021-01-01',
  players: {
    top: { full: 'John', short: 'John' },
    bottom: { full: 'Paul', short: 'Paul' }
  },
  targetScore: 7,
  games: [
    {
      events: [{ kind: 'start', timestamp: '00:00' }]
    }
  ]
}

describe('Search', () => {
  describe('multiple entries', () => {
    test('should return all entries when query is empty', () => {
      const results = search({}, [match1])

      expect(results).toEqual([match1])
    })

    test('should return all match entries', () => {
      const results = search(
        {
          title: 'NY',
          date: { from: new Date(match1.date), to: new Date(match1.date) }
        },
        [match1]
      )
      expect(results).toEqual([match1])
    })
  })

  describe('search', () => {
    test('should match by stream and date', () => {
      const results = search(
        {
          title: 'NY',
          date: { from: new Date(match1.date), to: new Date(match1.date) }
        },
        [match1]
      )

      expect(results).toEqual([match1])
    })

    describe('when matching by players', () => {
      test('should match by a single player', () => {
        const results = search({ players: 'John' }, [match1])

        expect(results).toEqual([match1])
      })

      test('should match by two players', () => {
        const results = search({ players: ['John', 'Paul'] }, [match1])

        expect(results).toEqual([match1])
      })

      test('should not match by a single player', () => {
        const results = search({ players: 'George' }, [match1])

        expect(results).toEqual([])
      })

      test('should not match by two players', () => {
        const results = search({ players: ['John', 'George'] }, [match1])

        expect(results).toEqual([])
      })
    })
  })
})
