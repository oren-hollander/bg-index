import { FC, useEffect, useRef, useState } from 'react'
import { Match, Players, timestampToSeconds } from '../services/match.ts'
import ReactPlayer from 'react-player/youtube'
import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { Events } from './Events.tsx'
import { MatchService } from '../services/matchService.ts'
import { CRUDService } from '../services/crud.ts'
import { Player } from '../services/players.ts'
import { Stream } from '../services/stream.ts'
import { CollectionValue } from '../CollectionValue.tsx'

interface ViewerProps {
  matchService: MatchService
  playerService: CRUDService<Player>
  streamService: CRUDService<Stream>
  matchId: string
}

export const Viewer: FC<ViewerProps> = ({
  matchId,
  matchService,
  streamService,
  playerService
}) => {
  const playerRef = useRef<ReactPlayer>(null)
  const [playing, setPlaying] = useState(true)

  const [match, setMatch] = useState<Match>()
  const [players, setPlayers] = useState<Players>()
  const [streamUrl, setStreamUrl] = useState<string>()

  const eventsDisclosure = useDisclosure()

  useEffect(() => {
    const init = async () => {
      const match = await matchService.getMatch(matchId)
      setMatch(match)
      if (match) {
        const topPlayer = await playerService.get(match.playerIds.top)
        const bottomPlayer = await playerService.get(match.playerIds.bottom)
        if (topPlayer && bottomPlayer) {
          setPlayers({ top: topPlayer, bottom: bottomPlayer })
        }

        const stream = await streamService.get(match.streamId)
        if (stream) {
          setStreamUrl(stream.url)
        }
      }
    }

    init().catch(console.error)
  }, [matchService, playerService, streamService, matchId])

  const jump = (timestamp: string) => {
    const seconds = timestampToSeconds(timestamp)
    playerRef.current?.seekTo(seconds, 'seconds')
    eventsDisclosure.onClose()
    setPlaying(true)
  }

  const start = () => {
    if (match) {
      playerRef.current?.seekTo(
        timestampToSeconds(match.games[0].events[0].timestamp),
        'seconds'
      )
    }
  }

  return (
    <Flex direction="column" h="100vh" bg={gray}>
      <Box bg="gray.700" color={white} w="100%" p={4}>
        <Flex>
          <Box paddingEnd={4} verticalAlign="middle">
            <Button colorScheme="blue" onClick={eventsDisclosure.onOpen}>
              Jump...
            </Button>
          </Box>
          {match && players && (
            <Box>
              <Text fontSize="xl">
                {match.title},
                <CollectionValue
                  service={streamService}
                  id={match.streamId}
                  fieldName="date"
                />
              </Text>
              <Text>
                {players.top.fullName} vs. {players.bottom.fullName}, Match to{' '}
                {match.targetScore}
              </Text>
            </Box>
          )}
          <Spacer />
        </Flex>
      </Box>
      {match && (
        <Events
          match={match}
          disclosure={eventsDisclosure}
          playerService={playerService}
          jump={jump}
        />
      )}

      <Flex flex="1" bg={gray}>
        <Box flex="1">
          {match && streamUrl && (
            <ReactPlayer
              width="100%"
              height="100%"
              ref={playerRef}
              playing={playing}
              onStart={start}
              url={streamUrl}
              controls={true}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
