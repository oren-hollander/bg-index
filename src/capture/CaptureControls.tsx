import { FC } from 'react'
import { Box, Button, ButtonGroup, Center, IconButton } from '@chakra-ui/react'
import { DoubleIcon, StartIcon } from './icons.tsx'
import { GameEvent, secondsToTimestamp } from '../matches/match.ts'
import {
  AttachmentIcon,
  CheckCircleIcon,
  CheckIcon,
  CloseIcon
} from '@chakra-ui/icons'
import { State, StateInput } from './StateInput.tsx'

interface CaptureControlsProps {
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
  progress,
  playerTurnState: [playerTurn, setPlayerTurn],
  topPlayerScoreState: [topPlayerScore, setTopPlayerScore],
  bottomPlayerScoreState: [bottomPlayerScore, setBottomPlayerScore],
  topPlayerName,
  bottomPlayerName,
  addEvent,
  exportMatch
}) => {
  return (
    <>
      <Center mt={4}>
        <ButtonGroup marginStart={4} colorScheme="green">
          <IconButton
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

      <Center>
        <ButtonGroup mt={4} colorScheme="green" variant="outline" pt={2}>
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
        <ButtonGroup mt={4} colorScheme="green" variant="outline" pt={2}>
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

      <Box mt={4}>
        <Button colorScheme="blue" onClick={exportMatch}>
          Export
        </Button>
      </Box>
    </>
  )
}
