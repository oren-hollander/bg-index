import { FC, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base'
import { GameEvent, NewMatch, timestampToSeconds } from '../services/match.ts'
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { filter, sortBy } from 'lodash/fp'
import { MatchDetails } from './MatchDetails.tsx'
import { CaptureControls } from './CaptureControls.tsx'
import { getExportedMatch } from './export.ts'
import { EventList } from './EventList.tsx'
import { ExportMatch } from './ExportMatch.tsx'
import { MatchService } from '../services/matchService.ts'
import { Player } from '../services/players.ts'
import { Event } from '../services/events.ts'
import { CRUDService } from '../services/crud.ts'
import { Stream } from '../services/stream.ts'

interface ContributeProps {
  playerService: CRUDService<Player>
  eventService: CRUDService<Event>
  streamService: CRUDService<Stream>
  matchService: MatchService
}

export const Contribute: FC<ContributeProps> = ({
  matchService,
  playerService,
  eventService,
  streamService
}) => {
  const playerRef = useRef<ReactPlayer>(null)

  const [captureUrl, setCaptureUrl] = useState<string>('')
  const [events, setEvents] = useState<GameEvent[]>([])
  const [progress, setProgress] = useState(0)

  const [url, setUrl] = useState('')
  const [stream, setStream] = useState<Stream>()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [targetScore, setTargetScore] = useState('')

  const [event, setEvent] = useState<Event>()
  const [topPlayer, setTopPlayer] = useState<Player>()
  const [bottomPlayer, setBottomPlayer] = useState<Player>()

  const [topPlayerScore, setTopPlayerScore] = useState('0')
  const [bottomPlayerScore, setBottomPlayerScore] = useState('0')

  const [playerTurn, setPlayerTurn] = useState<'top' | 'bottom'>('top')
  const [exportedMatch, setExportedMatch] = useState<NewMatch>()

  const exportMatchDisclosure = useDisclosure()

  const deleteEvent = (event: GameEvent) => {
    setEvents(events => filter(e => e !== event, events))
  }

  const setClipProgress = (state: OnProgressProps) => {
    setProgress(state.playedSeconds)
  }

  const startMatch = () => {
    setCaptureUrl(url)
  }

  const addEvent = (event: GameEvent) => {
    setEvents(events => {
      return sortBy(e => timestampToSeconds(e.timestamp), [...events, event])
    })

    if (event.kind === 'double') {
      setPlayerTurn(playerTurn === 'top' ? 'bottom' : 'top')
    }
  }

  const exportMatch = async () => {
    if (!topPlayer || !bottomPlayer || !stream) {
      return
    }

    setExportedMatch(
      getExportedMatch(stream, title, Number.parseInt(targetScore), events, {
        top: topPlayer._id,
        bottom: bottomPlayer._id
      })
    )

    exportMatchDisclosure.onOpen()
  }

  return (
    <Flex direction="row" bg={gray} h="100vh" w="100vw">
      <Box flex="3">
        {url !== '' && (
          <ReactPlayer
            width="100%"
            height="100vh"
            ref={playerRef}
            onProgress={setClipProgress}
            url={url}
            controls={true}
          />
        )}
      </Box>

      {exportedMatch && (
        <ExportMatch
          match={exportedMatch}
          disclosure={exportMatchDisclosure}
          matchService={matchService}
        />
      )}

      <Box
        flex={1}
        overflowY="auto"
        bg="gray.800"
        color={white}
        paddingStart={3}
        paddingEnd={2}
      >
        {captureUrl === '' && (
          <MatchDetails
            eventService={eventService}
            playerService={playerService}
            streamService={streamService}
            urlState={[url, setUrl]}
            streamState={[stream, setStream]}
            titleState={[title, setTitle]}
            dateState={[date, setDate]}
            targetScoreState={[targetScore, setTargetScore]}
            eventState={[event, setEvent]}
            topPlayerState={[topPlayer, setTopPlayer]}
            bottomPlayerState={[bottomPlayer, setBottomPlayer]}
            startMatch={startMatch}
          />
        )}

        {captureUrl !== '' && (
          <Flex direction="column" height="100vh">
            <Box top="0" width="full" zIndex="sticky">
              <Box mt={4}>
                <Button colorScheme="blue" onClick={exportMatch}>
                  Add to index
                </Button>
              </Box>

              <CaptureControls
                progress={progress}
                playerTurnState={[playerTurn, setPlayerTurn]}
                topPlayerScoreState={[topPlayerScore, setTopPlayerScore]}
                bottomPlayerScoreState={[
                  bottomPlayerScore,
                  setBottomPlayerScore
                ]}
                topPlayerName={topPlayer?.shortName ?? ''}
                bottomPlayerName={bottomPlayer?.shortName ?? ''}
                events={events}
                addEvent={addEvent}
                exportMatch={exportMatch}
              />
            </Box>
            <Box overflowY="auto">
              <EventList
                events={events}
                topPlayerName={topPlayer?.shortName ?? ''}
                bottomPlayerName={bottomPlayer?.shortName ?? ''}
                deleteEvent={deleteEvent}
              />
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}
