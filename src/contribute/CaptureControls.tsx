import { FC } from 'react'
import { Button, ButtonGroup, Center, IconButton } from '@chakra-ui/react'
import { DoubleIcon, StartIcon } from './icons.tsx'
import {
  GameEvent,
  secondsToTimestamp,
  timestampToSeconds
} from '../services/match.ts'
import {
  AttachmentIcon,
  CheckCircleIcon,
  CheckIcon,
  CloseIcon
} from '@chakra-ui/icons'
import { State, StateInput } from './StateInput.tsx'
import { findLast, isUndefined } from 'lodash/fp'

interface CaptureControlsProps {
  events: GameEvent[]
  progress: number
  playerTurnState: State<'top' | 'bottom'>
  topPlayerScoreState: State<string>
  bottomPlayerScoreState: State<string>
  topPlayerName: string
  bottomPlayerName: string
  addEvent(event: GameEvent): void
  exportMatch(): void
}

export const CaptureControls: FC<CaptureControlsProps> = ({
  events,
  progress,
  playerTurnState: [playerTurn, setPlayerTurn],
  topPlayerScoreState: [topPlayerScore, setTopPlayerScore],
  bottomPlayerScoreState: [bottomPlayerScore, setBottomPlayerScore],
  topPlayerName,
  bottomPlayerName,
  addEvent
}) => {
  const previousEvent = findLast(
    event => timestampToSeconds(event.timestamp) <= progress,
    events
  )

  const canStart = (): boolean =>
    previousEvent === undefined || previousEvent.kind === 'score'

  const canDouble = (): boolean =>
    !isUndefined(previousEvent) &&
    (previousEvent.kind === 'start' || previousEvent.kind === 'take')

  const canTake = (): boolean =>
    !isUndefined(previousEvent) && previousEvent.kind === 'double'

  const canDrop = (): boolean =>
    !isUndefined(previousEvent) && previousEvent.kind === 'double'

  const canWin = (): boolean =>
    !isUndefined(previousEvent) &&
    (previousEvent.kind === 'start' || previousEvent.kind === 'take')

  const canScore = (): boolean =>
    !isUndefined(previousEvent) &&
    (previousEvent.kind === 'win' || previousEvent.kind === 'drop')

  return (
    <>
      <Center>
        <ButtonGroup colorScheme="green" variant="outline" mt="1em">
          <Button
            w="7em"
            variant={playerTurn === 'top' ? 'solid' : 'outline'}
            onClick={() => setPlayerTurn('top')}
          >
            {topPlayerName}
          </Button>
          <StateInput
            me={1}
            w="3em"
            type="number"
            value={topPlayerScore}
            dispatch={setTopPlayerScore}
          />
        </ButtonGroup>
      </Center>

      <Center>
        <ButtonGroup colorScheme="green" variant="outline" mt="1em">
          <Button
            w="7em"
            variant={playerTurn === 'bottom' ? 'solid' : 'outline'}
            onClick={() => setPlayerTurn('bottom')}
          >
            {bottomPlayerName}
          </Button>
          <StateInput
            ms={1}
            w="3em"
            type="number"
            value={bottomPlayerScore}
            dispatch={setBottomPlayerScore}
          />
        </ButtonGroup>
      </Center>

      <Center mt="2em">
        <ButtonGroup marginStart={4} colorScheme="green">
          <IconButton
            isDisabled={!canStart()}
            isRound
            aria-label="Start"
            icon={<StartIcon />}
            onClick={() =>
              addEvent({
                kind: 'start',
                timestamp: secondsToTimestamp(progress)
              })
            }
          />
          <IconButton
            isDisabled={!canDouble()}
            isRound
            aria-label="Double"
            icon={<DoubleIcon />}
            onClick={() =>
              addEvent({
                kind: 'double',
                player: playerTurn,
                timestamp: secondsToTimestamp(progress)
              })
            }
          />
          <IconButton
            isDisabled={!canTake()}
            isRound
            aria-label="Take"
            icon={<CheckIcon />}
            onClick={() =>
              addEvent({
                kind: 'take',
                player: playerTurn,
                timestamp: secondsToTimestamp(progress)
              })
            }
          />
          <IconButton
            isDisabled={!canDrop()}
            isRound
            aria-label="Drop"
            icon={<CloseIcon />}
            onClick={() =>
              addEvent({
                kind: 'drop',
                player: playerTurn,
                timestamp: secondsToTimestamp(progress)
              })
            }
          />
          <IconButton
            isDisabled={!canWin()}
            isRound
            aria-label="Win"
            icon={<CheckCircleIcon />}
            onClick={() =>
              addEvent({
                kind: 'win',
                player: playerTurn,
                timestamp: secondsToTimestamp(progress)
              })
            }
          />
          <IconButton
            isDisabled={!canScore()}
            isRound
            aria-label="Score"
            icon={<AttachmentIcon />}
            onClick={() =>
              addEvent({
                kind: 'score',
                timestamp: secondsToTimestamp(progress),
                score: {
                  top: parseInt(topPlayerScore),
                  bottom: parseInt(bottomPlayerScore)
                }
              })
            }
          />
        </ButtonGroup>
      </Center>
    </>
  )
}
