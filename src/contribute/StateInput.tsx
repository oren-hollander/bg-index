import { Dispatch, FC, SetStateAction } from 'react'
import { Input, InputProps } from '@chakra-ui/react'

export type State<T> = [T, Dispatch<SetStateAction<T>>]

export const StateInput: FC<
  InputProps & {
    dispatch: Dispatch<SetStateAction<string>>
  }
> = ({ dispatch, ...props }) => (
  <Input onChange={e => dispatch(e.target.value)} {...props} />
)
