import { Match } from './match.ts'
import { MatchSchema } from './matchSchema.ts'

import match1 from './files/UBC 2023/ubc 2023 finals day 1 match 1.json'
import match2 from './files/UBC 2023/ubc 2023 finals day 1 match 2.json'
import match3 from './files/UBC 2023/ubc 2023 finals day 1 match 3.json'
import match6 from './files/UBC 2023/ubc 2023 finals day 1 match 4.json'
import match7 from './files/UBC 2023/ubc 2023 finals day 2 match 5.json'
import match4 from './files/USA UBC 2024/group-a-round-1-woosley-sahlen.json'
import match5 from './files/USA UBC 2024/group-b-round-1-ohagan-frigo.json'

const matchJsons = [match1, match2, match3, match4, match5, match6, match7]
const matchList = matchJsons.map(json => MatchSchema.parse(json))

export const matches = new Map<string, Match>(
  matchList.map(match => [match.id, match])
)
