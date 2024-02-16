import { FC } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { StateInput, State } from './StateInput.tsx'

interface MatchDetailsProps {
  urlState: State<string>
  streamState: State<string>
  titleState: State<string>
  dateState: State<string>
  targetScoreState: State<string>
  topPlayerFullNameState: State<string>
  topPlayerShortNameState: State<string>
  bottomPlayerFullNameState: State<string>
  bottomPlayerShortNameState: State<string>
  startMatch: () => void
}

export const MatchDetails: FC<MatchDetailsProps> = ({
  urlState: [url, setUrl],
  streamState: [stream, setStream],
  titleState: [title, setTitle],
  dateState: [date, setDate],
  targetScoreState: [targetScore, setTargetScore],
  topPlayerFullNameState: [topPlayerFullName, setTopPlayerFullName],
  topPlayerShortNameState: [topPlayerShortName, setTopPlayerShortName],
  bottomPlayerFullNameState: [bottomPlayerFullName, setBottomPlayerFullName],
  bottomPlayerShortNameState: [bottomPlayerShortName, setBottomPlayerShortName],
  startMatch
}) => {
  const canStartCapturing =
    url !== '' &&
    title !== '' &&
    date !== '' &&
    topPlayerFullName !== '' &&
    topPlayerShortName !== '' &&
    bottomPlayerFullName !== '' &&
    bottomPlayerShortName !== '' &&
    Number.parseInt(targetScore) > 0

  return (
    <Box>
      <Text mt={2}>Youtube URL</Text>
      <StateInput placeholder="Enter URL" value={url} dispatch={setUrl} />

      <Text mt={2}>Stream</Text>
      <StateInput value={stream} dispatch={setStream} />
      <Text mt={2}>Match title</Text>
      <StateInput value={title} dispatch={setTitle} />

      <Text mt={2}>Match date</Text>
      <StateInput type="date" value={date} dispatch={setDate} />

      <Text mt={2}>Match target score</Text>
      <StateInput type="number" value={targetScore} dispatch={setTargetScore} />

      <Text mt={2}>Top player</Text>
      <StateInput value={topPlayerFullName} dispatch={setTopPlayerFullName} />

      <Text mt={2}>Top player short name</Text>
      <StateInput value={topPlayerShortName} dispatch={setTopPlayerShortName} />

      <Text mt={2}>Bottom player</Text>
      <StateInput
        value={bottomPlayerFullName}
        dispatch={setBottomPlayerFullName}
      />

      <Text mt={2}>Bottom player short name</Text>
      <StateInput
        value={bottomPlayerShortName}
        dispatch={setBottomPlayerShortName}
      />
      <Button
        mt={4}
        colorScheme="green"
        isDisabled={!canStartCapturing}
        onClick={startMatch}
      >
        Start
      </Button>
    </Box>
  )
}
