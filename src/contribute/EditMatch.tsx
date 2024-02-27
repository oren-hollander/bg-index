import { FC, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base'
import { GameEvent, Match, timestampToSeconds } from '../services/match.ts'
import { Box, Button, Flex } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { filter, sortBy } from 'lodash/fp'
import { CaptureControls } from './CaptureControls.tsx'
import { EventList } from './EventList.tsx'
import { BSON } from 'realm-web'
import ObjectId = BSON.ObjectId
import { useServices } from '../services/services.ts'
import { Stream } from '../services/stream.ts'
import { Player } from '../services/player.ts'
import { getGameEvents, getGames } from './export.ts'

interface EditMatchProps {
  matchId: ObjectId
}

export const EditMatch: FC<EditMatchProps> = ({ matchId }) => {
  const playerRef = useRef<ReactPlayer>(null)

  const [events, setEvents] = useState<GameEvent[]>([])
  const [progress, setProgress] = useState(0)

  const [topPlayer, setTopPlayer] = useState<Player>()
  const [bottomPlayer, setBottomPlayer] = useState<Player>()

  const [topPlayerScore, setTopPlayerScore] = useState('0')
  const [bottomPlayerScore, setBottomPlayerScore] = useState('0')

  const [playerTurn, setPlayerTurn] = useState<'top' | 'bottom'>('top')
  const [match, setMatch] = useState<Match>()
  const [stream, setStream] = useState<Stream>()

  const services = useServices()

  useEffect(() => {
    const init = async () => {
      const match = await services.matchService.get(matchId)
      setMatch(match)
      if (match) {
        const stream = await services.streamService.get(match.streamId)
        setStream(stream)
        const topPlayer = await services.playerService.get(match.playerIds.top)
        setTopPlayer(topPlayer)
        const bottomPlayer = await services.playerService.get(
          match.playerIds.bottom
        )
        setBottomPlayer(bottomPlayer)
        setEvents(getGameEvents(match.games))
      }
    }

    init().catch(console.error)
  }, [
    matchId,
    services.matchService,
    services.streamService,
    services.playerService
  ])

  const deleteEvent = (event: GameEvent) => {
    setEvents(events => filter(e => e !== event, events))
  }

  const setClipProgress = (state: OnProgressProps) => {
    setProgress(state.playedSeconds)
  }

  const addEvent = (event: GameEvent) => {
    setEvents(events => {
      return sortBy(e => timestampToSeconds(e.timestamp), [...events, event])
    })

    if (event.kind === 'double') {
      setPlayerTurn(playerTurn === 'top' ? 'bottom' : 'top')
    }
  }

  const updateMatch = async () => {
    if (match && stream) {
      const games = getGames(events)
      await services.matchService.update(
        { _id: match._id },
        { $set: { games } }
      )
    }
  }

  if (!match || !topPlayer || !bottomPlayer || !stream) {
    return <Box>Loading...</Box>
  }
  return (
    <Flex direction="row" bg={gray} h="100vh" w="100vw">
      <Box flex="3">
        {stream?.url && (
          <ReactPlayer
            width="100%"
            height="100vh"
            ref={playerRef}
            onProgress={setClipProgress}
            url={stream.url}
            controls={true}
          />
        )}
      </Box>

      <Box
        flex={1}
        overflowY="auto"
        bg="gray.800"
        color={white}
        paddingStart={3}
        paddingEnd={2}
      >
        <Flex direction="column" height="100vh">
          <Box top="0" width="full" zIndex="sticky">
            <Box mt={4}>
              <Button colorScheme="blue" onClick={updateMatch}>
                Update
              </Button>
            </Box>

            <CaptureControls
              progress={progress}
              playerTurnState={[playerTurn, setPlayerTurn]}
              topPlayerScoreState={[topPlayerScore, setTopPlayerScore]}
              bottomPlayerScoreState={[bottomPlayerScore, setBottomPlayerScore]}
              topPlayerName={topPlayer.shortName}
              bottomPlayerName={bottomPlayer.shortName}
              events={events}
              addEvent={addEvent}
              updateMatch={updateMatch}
            />
          </Box>
          <Box overflowY="auto">
            <EventList
              events={events}
              topPlayerName={topPlayer.shortName}
              bottomPlayerName={bottomPlayer.shortName}
              deleteEvent={deleteEvent}
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}
