import { FC, useEffect, useState } from 'react'
import { Box, Button, Select, Text } from '@chakra-ui/react'
import { State, StateInput } from './StateInput.tsx'
import { Player } from '../services/player.ts'
import { Event } from '../services/event.ts'
import { Stream } from '../services/stream.ts'
import { useServices } from '../services/services.ts'

interface MatchDetailsProps {
  titleState: State<string>
  targetScoreState: State<string>

  streamState: State<Stream | undefined>
  eventState: State<Event | undefined>
  topPlayerState: State<Player | undefined>
  bottomPlayerState: State<Player | undefined>

  createMatch: () => void
}

export const MatchDetails: FC<MatchDetailsProps> = ({
  streamState: [stream, setStream],
  titleState: [title, setTitle],
  targetScoreState: [targetScore, setTargetScore],

  eventState: [event, setEvent],
  topPlayerState: [topPlayer, setTopPlayer],
  bottomPlayerState: [bottomPlayer, setBottomPlayer],
  createMatch
}) => {
  const [players, setPlayers] = useState<Player[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [streams, setStreams] = useState<Stream[]>([])

  const { playerService, eventService, streamService } = useServices()

  useEffect(() => {
    playerService.query({}, { sort: { fullName: 1 } }).then(setPlayers)
    eventService.query({}, { sort: { title: 1 } }).then(setEvents)
  }, [playerService, eventService])

  useEffect(() => {
    if (event !== undefined) {
      streamService.query({ eventId: event._id }).then(setStreams)
    }
  }, [streamService, event])

  const canStartCapturing =
    title !== '' &&
    event !== undefined &&
    stream !== undefined &&
    topPlayer !== undefined &&
    bottomPlayer !== undefined &&
    Number.parseInt(targetScore) > 0

  const findPlayer = (id: string): Player | undefined =>
    players?.find(p => p._id.toHexString() === id)

  const findEvent = (id: string): Event | undefined =>
    events?.find(e => e._id.toHexString() === id)

  const findStream = (id: string): Stream | undefined =>
    streams?.find(e => e._id.toHexString() === id)

  return (
    players &&
    events && (
      <Box>
        <Text mt={2}>Event</Text>
        <Select
          placeholder="Select event"
          onChange={e => setEvent(findEvent(e.target.value))}
        >
          {events.map(event => (
            <option
              key={event._id.toHexString()}
              value={event._id.toHexString()}
            >
              {event.title}
            </option>
          ))}
        </Select>

        <Text mt={2}>Stream</Text>
        <Select
          placeholder="Select stream"
          onChange={e => setStream(findStream(e.target.value))}
        >
          {streams.map(stream => (
            <option
              key={stream._id.toHexString()}
              value={stream._id.toHexString()}
            >
              {stream.title} ({stream.date})
            </option>
          ))}
        </Select>

        <Text mt={2}>Match title</Text>
        <StateInput value={title} dispatch={setTitle} />

        <Text mt={2}>Match target score</Text>
        <StateInput
          type="number"
          value={targetScore}
          dispatch={setTargetScore}
        />

        <Text mt={2}>Top player</Text>
        <Select
          placeholder="Select player"
          onChange={e => setTopPlayer(findPlayer(e.target.value))}
        >
          {players.map(player => (
            <option
              key={player._id.toHexString()}
              value={player._id.toHexString()}
            >
              {player.fullName}
            </option>
          ))}
        </Select>

        <Text mt={2}>Bottom player</Text>
        <Select
          placeholder="Select player"
          onChange={e => setBottomPlayer(findPlayer(e.target.value))}
        >
          {players.map(player => (
            <option
              key={player._id.toHexString()}
              value={player._id.toHexString()}
            >
              {player.fullName}
            </option>
          ))}
        </Select>

        <Button
          mt={4}
          colorScheme="green"
          isDisabled={!canStartCapturing}
          onClick={createMatch}
        >
          Create
        </Button>
      </Box>
    )
  )
}
