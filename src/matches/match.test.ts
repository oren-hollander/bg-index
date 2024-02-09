import { describe, expect, test } from 'vitest'
import { secondsToTimestamp } from './match.ts'

describe('load match', () => {
  test('secondsToTimestamp', () => {
    expect(secondsToTimestamp(0)).toBe('0')
    expect(secondsToTimestamp(59)).toBe('59')
    expect(secondsToTimestamp(60)).toBe('1:00')
    expect(secondsToTimestamp(61)).toBe('1:01')
    expect(secondsToTimestamp(3599)).toBe('59:59')
    expect(secondsToTimestamp(3600)).toBe('1:00:00')
  })
})
