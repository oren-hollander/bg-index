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
import { white } from '../colors.ts'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { GameEvent } from '../matches/match.ts'
import { FC } from 'react'

interface EventListProps {
  events: GameEvent[]
  topPlayerName: string
  bottomPlayerName: string
  deleteEvent(event: GameEvent): void
}

export const EventList: FC<EventListProps> = ({
  events,
  topPlayerName,
  bottomPlayerName,
  deleteEvent
}) => {
  const getPlayerName = (event: GameEvent) => {
    switch (event.kind) {
      case 'double':
      case 'take':
      case 'drop':
      case 'win':
        return event.player === 'top' ? topPlayerName : bottomPlayerName
      case 'score':
        return `${event.score.top} / ${event.score.bottom}`
      case 'start':
        return ''
    }
  }
  return (
    <Box color={white}>
      <Table>
        <Thead>
          <Tr>
            <Th color={white}>Player</Th>
            <Th color={white}>Action</Th>
            <Th color={white}>Time</Th>
            <Th color={white}>
              <SmallCloseIcon />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map(event => (
            <Tr key={`${event.kind}-${event.timestamp}`}>
              <Td>{getPlayerName(event)}</Td>
              <Td>{event.kind}</Td>
              <Td>{event.timestamp}</Td>
              <Td>
                <IconButton
                  size="xxs"
                  variant="outline"
                  color="red.300"
                  aria-label="Remove"
                  icon={<SmallCloseIcon />}
                  onClick={() => deleteEvent(event)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
