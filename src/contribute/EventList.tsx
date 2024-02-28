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
import { SmallCloseIcon } from '@chakra-ui/icons'
import { GameEvent, timestampToSeconds } from '../services/match.ts'
import { FC, ReactNode } from 'react'
import { reverse } from 'lodash/fp'

interface CellProp {
  children: ReactNode
  isLast: boolean
}

const Cell: FC<CellProp> = ({ children, isLast }) => (
  <Td borderColor={isLast ? gray : 'gray.500'}>{children}</Td>
)

interface EventListProps {
  events: GameEvent[]
  topPlayerName: string
  bottomPlayerName: string
  deleteEvent(event: GameEvent): void
  transpose(seconds: number): void
}

export const EventList: FC<EventListProps> = ({
  events,
  topPlayerName,
  bottomPlayerName,
  deleteEvent,
  transpose
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

  const isLast = (array: unknown[], index: number): boolean =>
    index === array.length - 1

  return (
    <Box color={white}>
      <Table>
        <Thead>
          <Tr>
            <Th borderColor="gray.400" color={white}>
              Player
            </Th>
            <Th borderColor="gray.400" color={white}>
              Action
            </Th>
            <Th borderColor="gray.400" color={white}>
              Time
            </Th>
            <Th borderColor="gray.400" color={white}>
              <SmallCloseIcon />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {reverse(events).map((event, i) => (
            <Tr
              cursor="pointer"
              key={`${event.kind}-${event.timestamp}`}
              onClick={() => transpose(timestampToSeconds(event.timestamp))}
            >
              <Cell isLast={isLast(events, i)}>{getPlayerName(event)}</Cell>
              <Cell isLast={isLast(events, i)}>{event.kind}</Cell>
              <Cell isLast={isLast(events, i)}>{event.timestamp}</Cell>
              <Cell isLast={isLast(events, i)}>
                <IconButton
                  cursor="pointer"
                  size="xxs"
                  variant="outline"
                  color="red.300"
                  aria-label="Remove"
                  icon={<SmallCloseIcon />}
                  onClick={e => {
                    e.stopPropagation()
                    deleteEvent(event)
                  }}
                />
              </Cell>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
