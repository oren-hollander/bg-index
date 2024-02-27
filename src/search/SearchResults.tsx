import { FC } from 'react'
import { Match } from '../services/match.ts'
import {
  Box,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { router } from '../router.ts'
import { CollectionValue } from '../CollectionValue.tsx'
import { EventTitle } from './EventTitle.tsx'
import { useServices } from '../services/services.ts'
import { EditIcon } from '@chakra-ui/icons'
import { useStore } from '@tanstack/react-store'
import { store } from '../main.tsx'

interface SearchResultsProps {
  matches: Match[]
}

export const SearchResults: FC<SearchResultsProps> = ({ matches }) => {
  const show = (matchId: string) => {
    router.push('Match', { matchId })
  }

  const services = useServices()
  const signedIn = useStore(store, state => state.signedIn)

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
            {signedIn && (
              <Th borderColor="gray.400" color={white}>
                Edit
              </Th>
            )}
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
                <EventTitle streamId={match.streamId} fieldName="title" />
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
              {signedIn && (
                <Td borderColor="gray.600">
                  <IconButton
                    onClick={e => {
                      e.stopPropagation()
                      router.push('EditMatch', {
                        matchId: match._id.toHexString()
                      })
                    }}
                    colorScheme="blue"
                    aria-label="Edit"
                    icon={<EditIcon />}
                  />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
