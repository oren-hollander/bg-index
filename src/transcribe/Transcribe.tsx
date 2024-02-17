import { FC, useState } from 'react'
import { Box } from '@chakra-ui/react'

export const Transcribe: FC = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const click = (x: number, y: number) => {
    setX(x)
    setY(y)
  }

  return (
    <Box
      position="absolute"
      // pointerEvents="none"
      as="svg"
      top={0}
      left={0}
      right={0}
      bottom={0}
      width="100%"
      height="100%"
      // viewBox="0 0 500 500"
      onClick={e => click(e.clientX, e.clientY - 80)}
    >
      <circle cx={x} cy={y} r="25" fill="#0000FF99" pointerEvents="auto" />
    </Box>
  )
}
