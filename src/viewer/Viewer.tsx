import { FC, useEffect, useRef, useState } from 'react'
import { Match, timestampToSeconds } from '../matches/match.ts'
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
import { MatchService } from '../matches/matchService.ts'
import { Credentials } from 'realm-web'

interface ViewerProps {
  matchId: string
}

export const Viewer: FC<ViewerProps> = ({ matchId }) => {
  const playerRef = useRef<ReactPlayer>(null)
  const [playing, setPlaying] = useState(true)

  const [match, setMatch] = useState<Match>()

  const eventsDisclosure = useDisclosure()

  useEffect(() => {
    const init = async () => {
      const matchService = await MatchService.connect(Credentials.anonymous())
      const match = await matchService.getMatch(matchId)
      setMatch(match)
    }

    init().catch(console.error)
  }, [matchId])

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
          {match && (
            <Box>
              <Text fontSize="xl">
                {match.title}, {new Date(match.date).toDateString()}
              </Text>
              <Text>
                {match.players.top.full} vs. {match.players.bottom.full}, Match
                to {match.targetScore}
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
          {match && (
            <ReactPlayer
              width="100%"
              height="100%"
              ref={playerRef}
              playing={playing}
              onStart={start}
              url={match.url}
              controls={true}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
