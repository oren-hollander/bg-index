import { FC } from 'react'
import {
  Box,
  Button,
  Code,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useClipboard,
  UseDisclosureReturn
} from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { NewMatch } from '../matches/match.ts'

interface ExportMatchProps {
  match: NewMatch
  disclosure: UseDisclosureReturn
}

export const ExportMatch: FC<ExportMatchProps> = ({
  match,
  disclosure: { onClose, isOpen }
}) => {
  const { onCopy } = useClipboard(JSON.stringify(match ?? {}, null, 2))

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={gray} color={white}>
        <ModalHeader>Export match</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box flex="3" overflowY="auto">
            <pre>
              <Code m="1em" bg="gray.700" color={white}>
                {JSON.stringify(match, null, 2)}
              </Code>
            </pre>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button m="0.5em" colorScheme="green" onClick={onCopy}>
            Copy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
