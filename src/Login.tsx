import { FC, useState } from 'react'
import { Box, Button, Text, Flex, Input } from '@chakra-ui/react'
import { useAuthService } from './services/services.ts'
import { router } from './router.ts'
import { store } from './main.tsx'
import { gray, white } from './colors.ts'

export const Login: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const authService = useAuthService()

  const login = async () => {
    await authService.signIn(email, password)
    store.setState(state => ({
      ...state,
      signedIn: authService.isSignedIn()
    }))

    router.push('Home')
  }

  return (
    <Flex
      bg={gray}
      color={white}
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Text>Email</Text>
        <Input
          m="0.5em"
          placeholder="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Text>Password</Text>
        <Input
          m="0.5em"
          placeholder="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button m="0.5em" onClick={login} colorScheme="blue">
          Login
        </Button>
      </Box>
    </Flex>
  )
}
