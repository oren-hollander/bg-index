import { FC, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { once } from 'lodash/fp'

interface VideoPreviewProps {
  url: string
  timestamp: number
}

export const VideoPreview: FC<VideoPreviewProps> = ({ url, timestamp }) => {
  const player = useRef<ReactPlayer>(null)
  const [playing, setPlaying] = useState(false)

  const reset = () => {
    player.current?.seekTo(timestamp, 'seconds')
    setPlaying(true)
  }

  return (
    <ReactPlayer
      width={1200}
      height={800}
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
