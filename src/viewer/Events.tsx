import { FC, Dispatch, SetStateAction } from 'react'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  FormControl,
  UseDisclosureReturn,
  FormLabel,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { EventKind, Match } from '../matches/match.ts'
import { Score } from './Score.tsx'

const getEventText = (kind: EventKind): string => `${kind}s`

export type State<T> = [T, Dispatch<SetStateAction<T>>]

interface EventsProps {
  match: Match
  disclosure: UseDisclosureReturn
  spoilerProtectionState: State<boolean>
  jump(timestamp: string): void
}

export const Events: FC<EventsProps> = ({
  match,
  disclosure,
  spoilerProtectionState: [spoilerProtection, setSpoilerProtection],
  jump
}) => {
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
              <Score scores={game.startScore} names={match.players} />
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
                    {game.events.map(event => (
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
