import { Icon } from '@chakra-ui/react'

export const StartIcon = () => (
  <Icon viewBox="0 0 200 200">
    <path fill="currentColor" d="M 60, 50 L 140, 100 L 60, 150 Z" />
  </Icon>
)

export const StopIcon = () => (
  <Icon viewBox="0 0 200 200">
    <path fill="currentColor" d="M 50, 50 H 150 V 150 H 50 Z" />
  </Icon>
)

export const DoubleIcon = () => (
  <Icon viewBox="0 0 200 200">
    <text
      x="0"
      y="150"
      fill="currentColor"
      fontSize="170"
      fontFamily="Arial, sans-serif"
    >
      x2
    </text>
  </Icon>
)

export const TakeIcon = () => (
  <Icon viewBox="0 0 200 200">
    <path
      fill="currentColor"
      d="M 50, 100 L 80, 130 L 150, 60"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
    />
  </Icon>
)

export const DropIcon = () => (
  <Icon viewBox="0 0 200 200">
    <path
      fill="currentColor"
      d="M 50, 50 L 150, 150 M 150, 50 L 50, 150"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
    />
  </Icon>
)
