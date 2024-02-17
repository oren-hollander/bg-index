import { FC, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UseDisclosureReturn,
  useToast
} from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { NewMatch } from '../matches/match.ts'
import { MatchService } from '../matches/matchService.ts'
import { Credentials } from 'realm-web'

interface ExportMatchProps {
  match: NewMatch
  disclosure: UseDisclosureReturn
}

export const ExportMatch: FC<ExportMatchProps> = ({
  match,
  disclosure: { onClose, isOpen }
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()

  const insertMatch = async () => {
    try {
      const matchService = await MatchService.connect(
        Credentials.emailPassword(email, password)
      )
      await matchService.addMatch({
        ...match,
        contributor: email
      })
      toast({
        title: 'Match successfully added',
        status: 'success',
        duration: 7000,
        isClosable: true
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast({
        title: 'Error adding match.',
        description: e.error,
        status: 'error',
        duration: 7000,
        isClosable: true
      })
      console.error('Error')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={gray} color={white}>
        <ModalHeader>Add match</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Flex direction="row" mt="1em">
              <Text mr="1em" w="6em" align="right">
                email
              </Text>
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            </Flex>
            <Flex direction="row" mt="1em">
              <Text mr="1em" w="6em" align="right">
                password
              </Text>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            m="0.5em"
            colorScheme="green"
            onClick={insertMatch}
            isDisabled={email === '' || password === ''}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
