import { FC, useEffect, useState } from 'react'
import { DateQuery, Query, queryMatches } from './query.ts'
import { SearchResults } from './SearchResults.tsx'
import { Match } from '../services/match.ts'
import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react'
import { gray, white } from '../colors.ts'
import { router } from '../router.ts'
import { Services } from '../services/services.ts'

interface SearchProps {
  services: Services
}

export const Search: FC<SearchProps> = ({ services }) => {
  const [event, setEvent] = useState('')
  const [stream, setStream] = useState('')
  const [match, setMatch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [searchResults, setSearchResults] = useState<Match[]>([])

  useEffect(() => {
    const init = async () => {
      const matches = await services.matchService.query({})
      setSearchResults(matches)
    }

    init().catch(console.error)
  }, [services.matchService])

  const getDateQuery = (
    fromDate: string,
    toDate: string
  ): DateQuery | undefined => {
    if (fromDate === '' && toDate !== '') {
      return { from: fromDate, to: toDate }
    }
    if (fromDate !== '') {
      return { from: fromDate }
    }
    if (toDate !== '') {
      return { to: toDate }
    }
  }

  const performSearch = async () => {
    const query: Query = {
      event: event === '' ? undefined : event,
      stream: stream === '' ? undefined : stream,
      match: match === '' ? undefined : match,
      date: getDateQuery(fromDate, toDate),
      players:
        player1 !== '' && player2 !== ''
          ? [player1, player2]
          : player1 !== ''
            ? player1
            : player2 !== ''
              ? player2
              : undefined
    }
    const results = await queryMatches(services, query)
    setSearchResults(results)
  }

  return (
    <Flex direction="column" h="100vh">
      <Box bg={gray} w="100%" p={4} color="white">
        <Flex direction="row">
          <Stack paddingEnd={2}>
            <Text color={white}>Event</Text>
            <Input
              type="text"
              value={event}
              onChange={e => setEvent(e.target.value)}
            />
          </Stack>
          <Stack paddingEnd={2}>
            <Text color={white}>Stream</Text>
            <Input
              type="text"
              value={stream}
              onChange={e => setStream(e.target.value)}
            />
          </Stack>
          <Stack paddingEnd={2}>
            <Text color={white}>Match</Text>
            <Input
              type="text"
              value={match}
              onChange={e => setMatch(e.target.value)}
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
          <SearchResults matches={searchResults} services={services} />
        </Box>
      </Flex>
    </Flex>
  )
}
