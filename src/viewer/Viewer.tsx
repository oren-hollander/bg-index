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
import { CollectionValue } from '../CollectionValue.tsx'
import { BSON } from 'realm-web'
import { useServices } from '../services/services.ts'
import ObjectId = BSON.ObjectId

interface ViewerProps {
  matchId: ObjectId
}

export const Viewer: FC<ViewerProps> = ({ matchId }) => {
  const playerRef = useRef<ReactPlayer>(null)
  const [playing, setPlaying] = useState(true)

  const [match, setMatch] = useState<Match>()
  const [players, setPlayers] = useState<Players>()
  const [streamUrl, setStreamUrl] = useState<string>()

  const eventsDisclosure = useDisclosure()

  const services = useServices()

  useEffect(() => {
    const init = async () => {
      const match = await services.matchService.get(matchId)
      setMatch(match)
      if (match) {
        const topPlayer = await services.playerService.get(match.playerIds.top)
        const bottomPlayer = await services.playerService.get(
          match.playerIds.bottom
        )
        if (topPlayer && bottomPlayer) {
          setPlayers({ top: topPlayer, bottom: bottomPlayer })
        }

        const stream = await services.streamService.get(match.streamId)
        if (stream) {
          setStreamUrl(stream.url)
        }
      }
    }

    init().catch(console.error)
  }, [services, matchId])

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
                  service={services.streamService}
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
        <Events match={match} disclosure={eventsDisclosure} jump={jump} />
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
