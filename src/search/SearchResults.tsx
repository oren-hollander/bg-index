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
            <Th color={white}>Title</Th>
            <Th color={white}>Date</Th>
            <Th color={white}>Event</Th>
          </Tr>
        </Thead>
        <Tbody>
          {matches.map(match => (
            <Tr onClick={() => show(match.id)} cursor="pointer">
              <Td>{match.title}</Td>
              <Td>{match.date}</Td>
              <Td>
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
