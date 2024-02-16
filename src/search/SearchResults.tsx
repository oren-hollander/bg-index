import { FC } from 'react'
import { Match } from '../matches/match.ts'
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { router } from '../router.ts'

interface SearchResultsProps {
  matches: Match[]
}

export const SearchResults: FC<SearchResultsProps> = ({ matches }) => {
  const show = (matchId: string) => {
    router.push('Match', { matchId })
  }

  return (
    <Box bg={gray}>
      <Table color={white}>
        <Thead>
          <Tr>
            <Th borderColor="gray.400" color={white}>
              Stream
            </Th>
            <Th borderColor="gray.400" color={white}>
              Title
            </Th>
            <Th borderColor="gray.400" color={white}>
              Date
            </Th>
            <Th borderColor="gray.400" color={white}>
              Match
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {matches.map(match => (
            <Tr
              key={match._id.toHexString()}
              onClick={() => show(match._id.toHexString())}
              cursor="pointer"
            >
              <Td borderColor="gray.600">{match.stream}</Td>
              <Td borderColor="gray.600">{match.title}</Td>
              <Td borderColor="gray.600">{match.date}</Td>
              <Td borderColor="gray.600">
                {match.players.top.full} vs. {match.players.bottom.full}, match
                to {match.targetScore}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
