import { FC, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base'
import {
  EventKind,
  GameEvent,
  NewMatch,
  timestampToSeconds
} from '../matches/match.ts'
import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { filter, omit, sortBy } from 'lodash/fp'
import { MatchDetails } from './MatchDetails.tsx'
import { CaptureControls } from './CaptureControls.tsx'
import { getExportedMatch } from './export.ts'
import { EventList } from './EventList.tsx'
import { ExportMatch } from './ExportMatch.tsx'

export const Contribute: FC = () => {
  const playerRef = useRef<ReactPlayer>(null)

  const [captureUrl, setCaptureUrl] = useState<string>('')
  const [events, setEvents] = useState<GameEvent[]>([])
  const [progress, setProgress] = useState(0)

  const [url, setUrl] = useState('')
  const [stream, setStream] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [targetScore, setTargetScore] = useState('')
  const [topPlayerFullName, setTopPlayerFullName] = useState('')
  const [topPlayerShortName, setTopPlayerShortName] = useState('')
  const [bottomPlayerFullName, setBottomPlayerFullName] = useState('')
  const [bottomPlayerShortName, setBottomPlayerShortName] = useState('')

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
    const getEventKindOrder = (kind: EventKind) => {
      switch (kind) {
        case 'start':
          return 1
        case 'double':
          return 2
        case 'take':
          return 3
        case 'drop':
          return 4
        case 'win':
          return 5
        case 'score':
          return 6
      }
    }

    setEvents(events => {
      const es = [...events, event].map(e => ({
        ...e,
        s: timestampToSeconds(e.timestamp),
        k: getEventKindOrder(e.kind)
      }))

      const es2 = sortBy(['s', 'k'], es)
      return es2.map(e => omit(['s', 'k'], e)) as GameEvent[]
    })

    if (event.kind === 'double') {
      setPlayerTurn(playerTurn === 'top' ? 'bottom' : 'top')
    }
  }

  const exportMatch = () => {
    setExportedMatch(
      getExportedMatch(
        url,
        stream,
        title,
        date,
        Number.parseInt(targetScore),
        events,
        {
          top: {
            full: topPlayerFullName,
            short: topPlayerShortName
          },
          bottom: {
            full: bottomPlayerFullName,
            short: bottomPlayerShortName
          }
        }
      )
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
        <ExportMatch match={exportedMatch} disclosure={exportMatchDisclosure} />
      )}

      <Box
        flex={1}
        overflowY="auto"
        color={white}
        paddingStart={3}
        paddingEnd={2}
        bg="gray.800"
      >
        {captureUrl === '' && (
          <MatchDetails
            urlState={[url, setUrl]}
            streamState={[stream, setStream]}
            titleState={[title, setTitle]}
            dateState={[date, setDate]}
            targetScoreState={[targetScore, setTargetScore]}
            topPlayerFullNameState={[topPlayerFullName, setTopPlayerFullName]}
            topPlayerShortNameState={[
              topPlayerShortName,
              setTopPlayerShortName
            ]}
            bottomPlayerFullNameState={[
              bottomPlayerFullName,
              setBottomPlayerFullName
            ]}
            bottomPlayerShortNameState={[
              bottomPlayerShortName,
              setBottomPlayerShortName
            ]}
            startMatch={startMatch}
          />
        )}

        {captureUrl !== '' && (
          <>
            <CaptureControls
              progress={progress}
              playerTurnState={[playerTurn, setPlayerTurn]}
              topPlayerScoreState={[topPlayerScore, setTopPlayerScore]}
              bottomPlayerScoreState={[bottomPlayerScore, setBottomPlayerScore]}
              topPlayerName={topPlayerShortName}
              bottomPlayerName={bottomPlayerShortName}
              addEvent={addEvent}
              exportMatch={exportMatch}
            />

            <EventList
              events={events}
              topPlayerName={topPlayerShortName}
              bottomPlayerName={bottomPlayerShortName}
              deleteEvent={deleteEvent}
            />
          </>
        )}
      </Box>
    </Flex>
  )
}
