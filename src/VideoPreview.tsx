import { FC, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { once } from 'lodash/fp'

interface VideoPreviewProps {
  url: string
  timestamp: number
}

export const VideoPreview: FC<VideoPreviewProps> = ({ url, timestamp }) => {
  const player = useRef<ReactPlayer>(null)
  const [playing, setPlaying] = useState(true)

  const reset = () => {
    player.current?.seekTo(timestamp, 'seconds')
    setPlaying(false)
  }

  useEffect(() => {
    player.current?.seekTo(timestamp, 'seconds')
    setPlaying(false)
  }, [url, timestamp])

  return (
    <ReactPlayer
      width="100%"
      // height="100%"
      ref={player}
      muted={true}
      playing={playing}
      onReady={reset}
      onProgress={once(reset)}
      url={url}
      controls={true}
    />
  )
}
