import { FC, useEffect, useState } from 'react'
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
import {
  EventKind,
  GameEvent,
  Match,
  Players,
  ScoreEvent
} from '../services/match.ts'
import { Score } from './Score.tsx'
import { take } from 'lodash/fp'
import { usePlayerService } from '../services/services.ts'

const getEventText = (kind: EventKind): string => `${kind}s`

const getEventDescription = (players: Players, event: GameEvent): string => {
  switch (event.kind) {
    case 'start':
      return 'Game starts'
    case 'score':
      return `Score: ${event.score.top} / ${event.score.bottom}`
    case 'double':
    case 'take':
    case 'drop':
    case 'win':
      return `${players[event.player].shortName} ${getEventText(event.kind)}`
  }
}

interface EventsProps {
  match: Match
  disclosure: UseDisclosureReturn
  jump(timestamp: string): void
}

export const Events: FC<EventsProps> = ({ match, disclosure, jump }) => {
  const [spoilerProtection, setSpoilerProtection] = useState(true)
  const [players, setPlayers] = useState<Players>()
  const playerService = usePlayerService()

  useEffect(() => {
    const fetchPlayers = async () => {
      const [top, bottom] = await Promise.all([
        playerService.get(match.playerIds.top),
        playerService.get(match.playerIds.bottom)
      ])
      if (top && bottom) {
        setPlayers({ top, bottom })
      }
    }

    fetchPlayers().catch(console.error)
  })

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
            <Box key={`game-${i + 1}`} marginTop={5}>
              <Text fontSize="xl">Game #{i + 1}</Text>
              {!spoilerProtection &&
                players &&
                game.events[game.events.length - 1].kind === 'score' && (
                  <Score
                    scores={
                      (game.events[game.events.length - 1] as ScoreEvent).score
                    }
                    players={players}
                  />
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
                          {players && getEventDescription(players, event)}
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
