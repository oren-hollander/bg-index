import { FC } from 'react'
import { Match } from '../services/match.ts'
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { router } from '../router.ts'
import { CollectionValue } from '../CollectionValue.tsx'
import { EventTitle } from './EventTitle.tsx'
import { Services } from '../services/services.ts'

interface SearchResultsProps {
  matches: Match[]
  services: Services
}

export const SearchResults: FC<SearchResultsProps> = ({
  matches,
  services
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
              Date
            </Th>
            <Th borderColor="gray.400" color={white}>
              Event
            </Th>
            <Th borderColor="gray.400" color={white}>
              Stream
            </Th>
            <Th borderColor="gray.400" color={white}>
              Match
            </Th>
            <Th borderColor="gray.400" color={white}>
              Players
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
                  service={services.streamService}
                  id={match.streamId}
                  fieldName="date"
                  format={value => new Date(value).toDateString()}
                />
              </Td>
              <Td borderColor="gray.600">
                <EventTitle
                  services={services}
                  streamId={match.streamId}
                  fieldName="title"
                />
              </Td>
              <Td borderColor="gray.600">
                <CollectionValue
                  service={services.streamService}
                  id={match.streamId}
                  fieldName="title"
                />
              </Td>
              <Td borderColor="gray.600">
                {match.title}, Match to {match.targetScore}
              </Td>

              <Td borderColor="gray.600">
                <CollectionValue
                  service={services.playerService}
                  id={match.playerIds.top}
                  fieldName="fullName"
                />
                {' vs. '}
                <CollectionValue
                  service={services.playerService}
                  id={match.playerIds.bottom}
                  fieldName="fullName"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
