import { Match } from '../matches/match.ts'
import { MatchSchema } from '../matches/matchSchema.ts'

import match1 from '../matches/files/ubc 2023 finals day 1 match 1.json'
import match2 from '../matches/files/ubc 2023 finals day 1 match 2.json'
import match3 from '../matches/files/ubc 2023 finals day 1 match 3.json'

const matchJsons = [match1, match2, match3]
const matchList = matchJsons.map(json => MatchSchema.parse(json))

export const matches = new Map<string, Match>(
  matchList.map(match => [match.id, match])
)
