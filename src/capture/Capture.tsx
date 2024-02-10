import { Dispatch, FC, SetStateAction, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base'
import { v4 as uuid } from 'uuid'
import {
  EventKind,
  Game,
  GameEvent,
  Match,
  PlayerScores,
  secondsToTimestamp
} from '../matches/match.ts'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Code,
  Flex,
  IconButton,
  Input,
  InputProps,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import {
  CheckCircleIcon,
  CheckIcon,
  CloseIcon,
  SmallCloseIcon
} from '@chakra-ui/icons'
import { DoubleIcon, StartIcon } from './icons.tsx'
import { initial } from 'lodash/fp'

const StateInput: FC<
  InputProps & {
    dispatch: Dispatch<SetStateAction<string>>
  }
> = ({ dispatch, ...props }) => (
  <Input onChange={e => dispatch(e.target.value)} {...props} />
)

export const Capture: FC = () => {
  const playerRef = useRef<ReactPlayer>(null)
  const [url, setUrl] = useState('')

  const [captureUrl, setCaptureUrl] = useState<string>('')

  const [events, setEvents] = useState<GameEvent[]>([])
  const [progress, setProgress] = useState(0)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [targetScore, setTargetScore] = useState('')
  const [topPlayer, setTopPlayer] = useState('')
  const [topPlayerShortName, setTopPlayerShortName] = useState('')
  const [bottomPlayer, setBottomPlayer] = useState('')
  const [bottomPlayerShortName, setBottomPlayerShortName] = useState('')

  const [topPlayerScore, setTopPlayerScore] = useState('0')
  const [bottomPlayerScore, setBottomPlayerScore] = useState('0')

  const [scores, setScores] = useState<PlayerScores[]>([])

  const [playerTurn, setPlayerTurn] = useState<'top' | 'bottom'>('top')
  const [exprtedMatch, setExportedMatch] = useState<Match>()

  const deleteLastEvent = () => {
    setEvents(events => initial(events))
  }
  const setClipProgress = (state: OnProgressProps) => {
    setProgress(state.playedSeconds)
  }

  const startMatch = () => {
    setCaptureUrl(url)
  }

  const addEvent = (kind: EventKind) => () => {
    setEvents(events => [
      ...events,
      { kind, player: playerTurn, timestamp: secondsToTimestamp(progress) }
    ])

    if (kind === 'double') {
      setPlayerTurn(playerTurn === 'top' ? 'bottom' : 'top')
    }
    if (kind === 'start') {
      setScores(scores => [
        ...scores,
        { top: parseInt(topPlayerScore), bottom: parseInt(bottomPlayerScore) }
      ])
    }
  }

  const canStartCapturing = () => {
    const targetScoreValue = Number.parseInt(targetScore)
    return (
      url !== '' &&
      title !== '' &&
      date !== '' &&
      topPlayer !== '' &&
      bottomPlayer !== '' &&
      !Number.isNaN(targetScoreValue) &&
      targetScoreValue > 0
    )
  }

  const lastEvent = events[events.length - 1]

  const canStart = (): boolean => {
    const scoreExists =
      topPlayerScore !== '' &&
      parseInt(topPlayerScore) >= 0 &&
      bottomPlayerScore !== '' &&
      parseInt(bottomPlayerScore) >= 0

    return (
      (lastEvent === undefined ||
        lastEvent.kind === 'win' ||
        lastEvent.kind === 'drop') &&
      scoreExists
    )
  }
  const canDouble = (): boolean =>
    lastEvent?.kind === 'start' || lastEvent?.kind === 'take'

  const canTake = (): boolean => lastEvent?.kind === 'double'
  const canDrop = (): boolean => lastEvent?.kind === 'double'
  const canWin = (): boolean =>
    lastEvent?.kind === 'start' || lastEvent?.kind === 'take'

  const exportMatch = () => {
    const gameScores = [...scores]
    const games: Game[] = []
    let startScore: PlayerScores | undefined = undefined

    for (const event of events) {
      switch (event.kind) {
        case 'start':
          startScore = gameScores.shift()!
          break
        case 'drop':
        case 'win':
          games.push({
            startScore: startScore!,
            events
          })
          break
      }
    }

    const exportedMatch: Match = {
      id: uuid(),
      url,
      title,
      date,
      players: {
        top: { full: topPlayer, short: topPlayerShortName },
        bottom: { full: bottomPlayer, short: bottomPlayerShortName }
      },
      targetScore: Number.parseInt(targetScore),
      games
    }
    setExportedMatch(exportedMatch)
  }

  return (
    <Flex direction="row" bg={gray} h="100vh" w="100vw">
      <Box flex="3">
        <ReactPlayer
          width="100wh"
          height="100vh"
          ref={playerRef}
          onProgress={setClipProgress}
          url={captureUrl}
          controls={true}
        />
      </Box>

      <Box
        flex={1}
        overflowY="auto"
        color={white}
        paddingStart={3}
        paddingEnd={2}
        bg="gray.800"
      >
        {captureUrl === '' && (
          <Box>
            <Text mt={2}>Youtube URL</Text>
            <StateInput
              isDisabled={captureUrl !== ''}
              placeholder="Enter URL"
              value={url}
              dispatch={setUrl}
            />

            <Text mt={2}>Match title</Text>
            <StateInput
              isDisabled={captureUrl !== ''}
              value={title}
              dispatch={setTitle}
            />

            <Text mt={2}>Match date</Text>
            <StateInput
              isDisabled={captureUrl !== ''}
              type="date"
              value={date}
              dispatch={setDate}
            />

            <Text mt={2}>Match target score</Text>
            <StateInput
              isDisabled={captureUrl !== ''}
              type="number"
              value={targetScore}
              dispatch={setTargetScore}
            />

            <Text mt={2}>Top player</Text>
            <StateInput
              isDisabled={captureUrl !== ''}
              value={topPlayer}
              dispatch={setTopPlayer}
            />

            <Text mt={2}>Top player short name</Text>
            <StateInput
              isDisabled={captureUrl !== ''}
              value={topPlayerShortName}
              dispatch={setTopPlayerShortName}
            />

            <Text mt={2}>Bottom player</Text>
            <StateInput
              isDisabled={captureUrl !== ''}
              value={bottomPlayer}
              dispatch={setBottomPlayer}
            />

            <Text mt={2}>Bottom player short name</Text>
            <StateInput
              isDisabled={captureUrl !== ''}
              value={bottomPlayerShortName}
              dispatch={setBottomPlayerShortName}
            />
            <Button
              mt={4}
              colorScheme="green"
              isDisabled={!canStartCapturing() || captureUrl !== ''}
              onClick={startMatch}
            >
              Start
            </Button>
          </Box>
        )}

        {exprtedMatch === undefined && captureUrl !== '' && (
          <>
            <Center mt={4}>
              <ButtonGroup
                isDisabled={captureUrl === ''}
                marginStart={4}
                colorScheme="green"
              >
                <IconButton
                  isDisabled={!canStart()}
                  isRound
                  aria-label="Start"
                  icon={<StartIcon />}
                  onClick={addEvent('start')}
                />
                <IconButton
                  isDisabled={!canDouble()}
                  isRound
                  aria-label="Double"
                  icon={<DoubleIcon />}
                  onClick={addEvent('double')}
                />
                <IconButton
                  isDisabled={!canTake()}
                  isRound
                  aria-label="Take"
                  icon={<CheckIcon />}
                  onClick={addEvent('take')}
                />
                <IconButton
                  isDisabled={!canDrop()}
                  isRound
                  aria-label="Drop"
                  icon={<CloseIcon />}
                  onClick={addEvent('drop')}
                />
                <IconButton
                  isDisabled={!canWin()}
                  isRound
                  aria-label="Win"
                  icon={<CheckCircleIcon />}
                  onClick={addEvent('win')}
                />
              </ButtonGroup>
            </Center>

            <Center>
              <ButtonGroup
                mt={4}
                isDisabled={captureUrl === ''}
                size="sm"
                isAttached
                colorScheme="green"
                variant="outline"
              >
                <Button
                  w="7em"
                  variant={playerTurn === 'top' ? 'solid' : 'outline'}
                  onClick={() => setPlayerTurn('top')}
                >
                  {topPlayerShortName}
                </Button>
                <Button
                  w="7em"
                  variant={playerTurn === 'bottom' ? 'solid' : 'outline'}
                  onClick={() => setPlayerTurn('bottom')}
                >
                  {bottomPlayerShortName}
                </Button>
              </ButtonGroup>
            </Center>

            <Center>
              <Text mt={4}>Score</Text>
            </Center>

            <Center>
              <StateInput
                me={1}
                w="3em"
                type="number"
                value={topPlayerScore}
                dispatch={setTopPlayerScore}
              />
              <StateInput
                ms={1}
                w="3em"
                type="number"
                value={bottomPlayerScore}
                dispatch={setBottomPlayerScore}
              />
            </Center>

            <Box mt={4}>
              <Button colorScheme="blue" onClick={exportMatch}>
                Export
              </Button>
            </Box>

            <Box color={white}>
              <Table>
                <Thead>
                  <Tr>
                    <Th color={white}>Player</Th>
                    <Th color={white}>Action</Th>
                    <Th color={white}>Time</Th>
                    <Th color={white}>
                      <SmallCloseIcon />
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {events.map((event, i) => (
                    <Tr key={`${event.kind}-${event.timestamp}`}>
                      <Td>
                        {event.player === 'top'
                          ? topPlayerShortName
                          : bottomPlayerShortName}
                      </Td>
                      <Td>{event.kind}</Td>
                      <Td>{event.timestamp}</Td>
                      <Td>
                        <IconButton
                          isDisabled={i !== events.length - 1}
                          size="xxs"
                          variant="outline"
                          color="red.300"
                          aria-label="Remove"
                          icon={<SmallCloseIcon />}
                          onClick={deleteLastEvent}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </>
        )}

        {exprtedMatch && (
          <Box bg={gray}>
            <pre>
              <Code bg={'gray.800'} color={white}>
                {JSON.stringify(exprtedMatch, null, 2)}
              </Code>
            </pre>
          </Box>
        )}
      </Box>
    </Flex>
  )
}
