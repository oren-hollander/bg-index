import { FC, useEffect, useRef, useState } from 'react'
import { Query } from './search.ts'
import { SearchResults } from './SearchResults.tsx'
import { Match } from '../matches/match.ts'
import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import './input.css'
import { MatchService } from '../matches/matchService.ts'
import { router } from '../router.ts'
import { Credentials } from 'realm-web'

export const Search: FC = () => {
  const [stream, setStream] = useState('')
  const [title, setTitle] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [searchResults, setSearchResults] = useState<Match[]>([])

  const matchService = useRef<MatchService>()

  useEffect(() => {
    const init = async () => {
      const service = await MatchService.connect(Credentials.anonymous())
      const matches = await service.query({})
      setSearchResults(matches)
      matchService.current = service
    }

    init().catch(console.error)
  }, [])

  const performSearch = async () => {
    if (!matchService.current) {
      return
    }

    const query: Query = {
      title: title === '' ? undefined : title,
      stream: stream === '' ? undefined : stream,
      date:
        fromDate !== '' && toDate !== ''
          ? { from: new Date(fromDate), to: new Date(toDate) }
          : undefined,
      players:
        player1 !== '' && player2 !== ''
          ? [player1, player2]
          : player1 !== ''
            ? player1
            : player2 !== ''
              ? player2
              : undefined
    }
    const results = await matchService.current.query(query)
    setSearchResults(results)
  }

  return (
    <Flex direction="column" h="100vh">
      <Box bg={gray} w="100%" p={4} color="white">
        <Flex direction="row">
          <Stack paddingEnd={2}>
            <Text color={white}>Stream</Text>
            <Input
              type="text"
              value={stream}
              onChange={e => setStream(e.target.value)}
            />
          </Stack>
          <Stack paddingEnd={2}>
            <Text color={white}>Title</Text>
            <Input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Stack>
          <Stack paddingEnd={2}>
            <Text color={white}>From</Text>
            <Input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </Stack>
          <Stack paddingEnd={2}>
            <Text color={white}>To</Text>
            <Input
              color={white}
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </Stack>
          <Stack paddingEnd={2}>
            <Text color={white}>Player 1</Text>
            <Input
              type="text"
              value={player1}
              onChange={e => setPlayer1(e.target.value)}
            />
          </Stack>
          <Stack paddingEnd={2}>
            <Text color={white}>Player 2</Text>
            <Input
              type="text"
              value={player2}
              onChange={e => setPlayer2(e.target.value)}
            />
          </Stack>
          <Stack paddingEnd={2}>
            <Text>&nbsp;</Text>
            <Button colorScheme="blue" onClick={performSearch}>
              Search
            </Button>
          </Stack>

          <Stack paddingEnd={2}>
            <Text>&nbsp;</Text>
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => router.push('Contribute')}
            >
              Contribute
            </Button>
          </Stack>
        </Flex>
      </Box>

      <Flex flex="1" overflowY="auto">
        <Box flex="1" bg={gray}>
          <SearchResults matches={searchResults} />
        </Box>
      </Flex>
    </Flex>
  )
}
