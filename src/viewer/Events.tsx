import { FC, useState } from 'react'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UseDisclosureReturn
} from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { EventKind, GameEvent, Match } from '../matches/match.ts'
import { Score } from './Score.tsx'
import { take } from 'lodash/fp'

const getEventText = (kind: EventKind): string => `${kind}s`

interface EventsProps {
  match: Match
  disclosure: UseDisclosureReturn
  jump(timestamp: string): void
}

export const Events: FC<EventsProps> = ({ match, disclosure, jump }) => {
  const [spoilerProtection, setSpoilerProtection] = useState(true)

  const getGameEvents = (events: GameEvent[]): GameEvent[] => {
    if (spoilerProtection) {
      return take(1, events)
    } else {
      return events
    }
  }

  return (
    <Drawer
      isOpen={disclosure.isOpen}
      placement="left"
      onClose={disclosure.onClose}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent bg={gray} color={white}>
        <DrawerCloseButton />
        <DrawerBody>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              Spoiler protection
            </FormLabel>
            <Switch
              isChecked={spoilerProtection}
              onChange={e => setSpoilerProtection(e.target.checked)}
            />
          </FormControl>

          {match.games.map((game, i) => (
            <Box
              key={`${game.startScore.top}-${game.startScore.bottom}`}
              marginTop={5}
            >
              <Text fontSize="xl">Game #{i + 1}</Text>
              {!spoilerProtection && (
                <Score scores={game.startScore} names={match.players} />
              )}
              <TableContainer marginTop={3}>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th
                        sx={{ width: 'auto' }}
                        borderColor="gray.500"
                        color={white}
                      >
                        Time
                      </Th>
                      <Th borderColor="gray.500" color={white}>
                        Event
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getGameEvents(game.events).map(event => (
                      <Tr
                        key={`${event.kind}-${event.timestamp}`}
                        onClick={() => {
                          jump(event.timestamp)
                        }}
                        cursor="pointer"
                        color="yellow.200"
                      >
                        <Td sx={{ width: 'auto' }} borderColor="gray.500">
                          {event.timestamp}
                        </Td>
                        <Td borderColor="gray.500">
                          {match.players[event.player].short}{' '}
                          {getEventText(event.kind)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
