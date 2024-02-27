import { FC, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Box, Flex } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { MatchDetails } from './MatchDetails.tsx'
import { Player } from '../services/player.ts'
import { Event } from '../services/event.ts'
import { Stream } from '../services/stream.ts'
import { useMatchService } from '../services/services.ts'
import { toNumber } from 'lodash/fp'
import { router } from '../router.ts'

export const CreateMatch: FC = () => {
  const playerRef = useRef<ReactPlayer>(null)

  const [stream, setStream] = useState<Stream>()
  const [title, setTitle] = useState('')
  const [targetScore, setTargetScore] = useState('')

  const [event, setEvent] = useState<Event>()
  const [topPlayer, setTopPlayer] = useState<Player>()
  const [bottomPlayer, setBottomPlayer] = useState<Player>()

  const matchService = useMatchService()

  const createMatch = async () => {
    const targetScoreValue = toNumber(targetScore)

    if (
      stream &&
      topPlayer &&
      bottomPlayer &&
      !Number.isNaN(targetScoreValue)
    ) {
      const matchId = await matchService.add({
        title,
        streamId: stream?._id,
        games: [],
        targetScore: targetScoreValue,
        playerIds: {
          top: topPlayer._id,
          bottom: bottomPlayer._id
        }
      })
      router.push('EditMatch', { matchId: matchId.toHexString() })
    }
  }

  return (
    <Flex direction="row" bg={gray} h="100vh" w="100vw">
      <Box flex="3">
        {stream?.url && (
          <ReactPlayer
            width="100%"
            height="100vh"
            ref={playerRef}
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
        <MatchDetails
          streamState={[stream, setStream]}
          titleState={[title, setTitle]}
          targetScoreState={[targetScore, setTargetScore]}
          eventState={[event, setEvent]}
          topPlayerState={[topPlayer, setTopPlayer]}
          bottomPlayerState={[bottomPlayer, setBottomPlayer]}
          createMatch={createMatch}
        />
      </Box>
    </Flex>
  )
}
