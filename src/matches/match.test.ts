import { describe, expect, test } from 'vitest'
import { loadFromFile } from './match.ts'
import { join } from 'path'

describe('load match', () => {
  test('should load match', async () => {
    const match = await loadFromFile(
      join(__dirname, 'ubc 2023 finals day 1 match 1.yml')
    )
    expect(match).not.toBeUndefined()
  })
})
