import { FC } from 'react'
import { Text } from '@chakra-ui/react'
import { Players, PlayerScores } from '../services/match.ts'

interface ScoreProps {
  players: Players
  scores: PlayerScores
}

export const Score: FC<ScoreProps> = ({ players, scores }) => (
  <Text>
    {players.top.shortName}: {scores.top} / {players.bottom.shortName}:{' '}
    {scores.bottom}
  </Text>
)
