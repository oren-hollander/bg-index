import { describe, expect, test } from 'vitest'
import { Clip, parseQuery, VideoIndex } from './videoIndex.ts'

describe('VideoIndex', () => {
  const createClips = (): Clip[] => {
    const match = Clip(
      'https://example.com/clip1',
      0,
      parseQuery('match:NY Open 2022;matchScore:7;player:John,Paul;score:0,0')
    )

    const game = Clip(
      'https://example.com/clip1',
      0,
      parseQuery('match:NY Open 2023;matchScore:7;player:John,Paul;score:0,0')
    )

    const move = Clip(
      'https://example.com/clip1',
      1294623,
      parseQuery(
        'match:Chicago Open 2022;matchScore:7;player:John,Paul;score:0,0;dice:3,4'
      )
    )

    return [match, game, move]
  }

  test('should return no clips when query is empty', () => {
    const index = new VideoIndex(createClips())
    const clips = index.search('')
    expect(clips.length).toBe(0)
  })

  test('should return matches in NY', () => {
    const index = new VideoIndex(createClips())
    const ranges = index.search('match:NY')
    expect(ranges.length).toBe(2)
  })

  test('should return matches with specified dice', () => {
    const index = new VideoIndex(createClips())
    const ranges = index.search('dice:3,4')
    expect(ranges.length).toBe(1)
  })
})
