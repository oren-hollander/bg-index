import { describe, expect, test } from 'vitest'
import { loadFromFile, saveToFile, secondsToTimestamp } from './match.ts'
import { join } from 'path'

describe('load match', () => {
  test('should load match', async () => {
    const match = await loadFromFile(
      join(__dirname, 'ubc 2023 finals day 1 match 1.yml')
    )
    expect(match).not.toBeUndefined()
  })

  test('should write match', async () => {
    const match = await loadFromFile(
      join(__dirname, 'ubc 2023 finals day 1 match 1.yml')
    )

    await saveToFile(
      join(__dirname, 'copy of ubc 2023 finals day 1 match 1.yml'),
      match
    )
  })

  test('secondsToTimestamp', () => {
    expect(secondsToTimestamp(0)).toBe('0')
    expect(secondsToTimestamp(59)).toBe('59')
    expect(secondsToTimestamp(60)).toBe('1:00')
    expect(secondsToTimestamp(61)).toBe('1:01')
    expect(secondsToTimestamp(3599)).toBe('59:59')
    expect(secondsToTimestamp(3600)).toBe('1:00:00')
  })
})
