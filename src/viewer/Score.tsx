import { FC } from 'react'
import { Text } from '@chakra-ui/react'
import { Name, Players } from '../matches/match.ts'

interface ScoreProps {
  names: Players<Name>
  scores: Players<number>
}

export const Score: FC<ScoreProps> = ({ names, scores }) => (
  <Text>
    {names.top.short}: {scores.top} / {names.bottom.short}: {scores.bottom}
  </Text>
)
