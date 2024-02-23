import { router } from './router.ts'
import { Viewer } from './viewer/Viewer.tsx'
import { Contribute } from './contribute/Contribute.tsx'
import { CrudEditor } from './contribute/CrudEditor.tsx'
import { CRUDService } from './services/crud.ts'
import { Credentials } from 'realm-web'
import { FC, useEffect, useRef, useState } from 'react'
import { Services } from './services/services.ts'
import { MatchService } from './services/matchService.ts'
import { getDatabase } from './services/database.ts'
import { Match } from './services/match.ts'
import { Player } from './services/players.ts'
import { Event } from './services/events.ts'
import { Search } from './search/Search.tsx'

const App: FC = () => {
  const services = useRef<Services>()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const credentials = Credentials.anonymous()
      const database = await getDatabase(credentials)

      services.current = {
        events: new CRUDService(database.collection<Event>('events')),
        players: new CRUDService(database.collection<Player>('players')),
        matches: new MatchService(database.collection<Match>('matches')),
        streams: new CRUDService(database.collection('streams'))
      }

      setReady(true)
    }

    init().catch(console.error)
  }, [])

  const route = router.useRoute([
    'Home',
    'Match',
    'Contribute',
    'Players',
    'Events'
  ])

  if (!ready || !services.current) {
    return null
  }

  switch (route?.name) {
    case 'Home':
      return (
        <Search
          matchService={services.current.matches}
          playerService={services.current.players}
          streamService={services.current.streams}
        />
      )
    case 'Match':
      return (
        <Viewer
          matchId={route.params.matchId}
          matchService={services.current.matches}
          playerService={services.current.players}
          streamService={services.current.streams}
        />
      )
    case 'Contribute':
      return (
        <Contribute
          matchService={services.current.matches}
          playerService={services.current.players}
          eventService={services.current.events}
          streamService={services.current.streams}
        />
      )
    case 'Players':
      return (
        <CrudEditor
          fields={[
            { name: 'fullName', type: 'string' },
            { name: 'shortName', type: 'string' }
          ]}
          service={services.current.players}
        />
      )
    case 'Events':
      return (
        <CrudEditor
          fields={[
            { name: 'title', type: 'string' },
            { name: 'date', type: 'date' }
          ]}
          service={services.current.events}
        />
      )
    default:
      router.replace('Home')
      return null
  }
}

export default App
