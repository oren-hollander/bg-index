import { FC, useRef, useState } from 'react'
import {
  EventKind,
  Name,
  Players,
  timestampToSeconds
} from '../matches/match.ts'
import ReactPlayer from 'react-player/youtube'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { matches } from '../search/matches.ts'

interface ScoreProps {
  names: Players<Name>
  scores: Players<number>
}

const Score: FC<ScoreProps> = ({ names, scores }) => (
  <Text>
    {names.top.short}: {scores.top} / {names.bottom.short}: {scores.bottom}
  </Text>
)

const getEventText = (kind: EventKind): string => `${kind}s`

interface ViewerProps {
  matchId: string
}

export const Viewer: FC<ViewerProps> = ({ matchId }) => {
  const match = matches.get(matchId)!
  const playerRef = useRef<ReactPlayer>(null)
  const [playing, setPlaying] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const jump = (timestamp: string) => () => {
    const seconds = timestampToSeconds(timestamp)
    playerRef.current?.seekTo(seconds, 'seconds')
    onClose()
    setPlaying(true)
  }

  const start = () => {
    playerRef.current?.seekTo(
      timestampToSeconds(match.games[0].events[0].timestamp),
      'seconds'
    )
  }

  return (
    <Flex direction="column" h="100vh">
      <Box bg="gray.700" color={white} w="100%" p={4}>
        <Flex>
          <Box paddingEnd={4} verticalAlign="middle">
            <Button colorScheme="blue" onClick={onOpen}>
              Jump...
            </Button>
          </Box>
          <Box>
            <Text fontSize="xl">
              {match.title}, {new Date(match.date).toDateString()}
            </Text>
            <Text>
              {match.players.top.full} vs. {match.players.bottom.full}, Match to{' '}
              {match.targetScore}
            </Text>
          </Box>
          <Spacer />
        </Flex>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg={gray} color={white}>
          <DrawerCloseButton />
          <DrawerBody>
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
                          onClick={jump(event.timestamp)}
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

      <Flex flex="1" bg={gray}>
        <Box flex="1">
          <ReactPlayer
            width="100%"
            height="100%"
            ref={playerRef}
            playing={playing}
            onStart={start}
            url={match.url}
            controls={true}
          />
        </Box>
      </Flex>
    </Flex>
  )
}
