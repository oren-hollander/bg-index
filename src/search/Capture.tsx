import { FC, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base'
import { GameEvent, secondsToTimestamp } from '../matches/match.ts'

export const Capture: FC = () => {
  const playerRef = useRef<ReactPlayer>(null)
  const [url, setUrl] = useState<string>(
    'https://www.youtube.com/watch?v=8B6cJAGALuE'
  )

  const [captureUrl, setCaptureUrl] = useState<string>()

  const [events, setEvents] = useState<GameEvent[]>([])

  const progress = (state: OnProgressProps) => {
    state.playedSeconds
  }

  const startMatch = () => {
    setCaptureUrl(url)
  }

  const endMatch = () => {}

  const startGame = () => {
    const player = playerRef.current
    if (!player) {
      return
    }

    setEvents(events => [
      ...events,
      {
        kind: 'start',
        timestamp: secondsToTimestamp(player.getCurrentTime()),
        player: 'top'
      }
    ])
  }

  return (
    <>
      <div>
        <input
          value={url}
          onChange={e => {
            setUrl(e.target.value)
          }}
        />
      </div>
      <div>
        <label>
          Title: <input />
        </label>
      </div>
      <div>
        <label>
          Date: <input type="date" />
        </label>
      </div>
      <div>
        <label>
          Top Player: <input />
        </label>
      </div>
      <div>
        <label>
          Bottom Player: <input />
        </label>
      </div>
      <div>
        <label>
          Target Score: <input type="number" />
        </label>
      </div>
      <div>
        <button disabled={url === ''} onClick={startMatch}>
          Start Match
        </button>
        <button disabled={url === ''} onClick={endMatch}>
          End Match
        </button>
      </div>
      <div>Score:</div>
      <div>
        <label>
          Top player: <input type="number" />
        </label>
      </div>
      <div>
        <label>
          Bottom player: <input type="number" />
        </label>
      </div>
      <div>
        <button onClick={startGame}>Start</button>
        <button onClick={startGame}>Double</button>
        <button onClick={startGame}>Take</button>
        <button onClick={startGame}>Drop</button>
        <button onClick={startGame}>Win</button>
      </div>
      <div>
        <pre>{JSON.stringify(events, null, 2)}</pre>
      </div>
      <div>
        <ReactPlayer
          width={1200}
          height={800}
          ref={playerRef}
          playing={false}
          onProgress={progress}
          url={captureUrl}
          controls={true}
        />
      </div>
    </>
  )
}
