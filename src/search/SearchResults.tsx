import { FC } from 'react'
import { Match } from '../services/match.ts'
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { router } from '../router.ts'
import { CollectionValue } from '../CollectionValue.tsx'
import { Stream } from '../services/stream.ts'
import { CRUDService } from '../services/crud.ts'
import { Player } from '../services/players.ts'

interface SearchResultsProps {
  matches: Match[]
  streamService: CRUDService<Stream>
  playerService: CRUDService<Player>
}

export const SearchResults: FC<SearchResultsProps> = ({
  matches,
  streamService,
  playerService
}) => {
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
              <Td borderColor="gray.600">
                <CollectionValue
                  service={streamService}
                  id={match.streamId}
                  fieldName="title"
                />
              </Td>
              <Td borderColor="gray.600">{match.title}</Td>
              <Td borderColor="gray.600">
                <CollectionValue
                  service={streamService}
                  id={match.streamId}
                  fieldName="date"
                />
              </Td>
              <Td borderColor="gray.600">
                <CollectionValue
                  service={playerService}
                  id={match.playerIds.top}
                  fieldName="fullName"
                />
                {' vs. '}
                <CollectionValue
                  service={playerService}
                  id={match.playerIds.bottom}
                  fieldName="fullName"
                />
                , Match to {match.targetScore}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
