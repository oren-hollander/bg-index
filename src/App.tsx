import { router } from './router.ts'
import { Viewer } from './viewer/Viewer.tsx'
import { Contribute } from './contribute/Contribute.tsx'
import { CrudEditor } from './contribute/CrudEditor.tsx'
import { CRUDService } from './services/crud.ts'
import { BSON, Credentials } from 'realm-web'
import { FC, useEffect, useRef, useState } from 'react'
import { Services } from './services/services.ts'
import { getDatabase } from './services/database.ts'
import { Match } from './services/match.ts'
import { Player } from './services/player.ts'
import { Event } from './services/event.ts'
import { Search } from './search/Search.tsx'
import ObjectId = BSON.ObjectId
import { Stream } from './services/stream.ts'

const App: FC = () => {
  const services = useRef<Services>()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const credentials = Credentials.anonymous()
      const database = await getDatabase(credentials)

      services.current = {
        eventService: new CRUDService(database.collection<Event>('events')),
        playerService: new CRUDService(database.collection<Player>('players')),
        matchService: new CRUDService(database.collection<Match>('matches')),
        streamService: new CRUDService(database.collection<Stream>('streams'))
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
    'Events',
    'Streams'
  ])

  if (!ready || !services.current) {
    return null
  }

  switch (route?.name) {
    case 'Home':
      return <Search services={services.current} />
    case 'Match':
      return (
        <Viewer
          matchId={ObjectId.createFromHexString(route.params.matchId)}
          matchService={services.current.matchService}
          playerService={services.current.playerService}
          streamService={services.current.streamService}
        />
      )
    case 'Contribute':
      return (
        <Contribute
          matchService={services.current.matchService}
          playerService={services.current.playerService}
          eventService={services.current.eventService}
          streamService={services.current.streamService}
        />
      )
    case 'Players':
      return (
        <CrudEditor
          fields={[
            { name: 'fullName', type: 'string' },
            { name: 'shortName', type: 'string' }
          ]}
          service={services.current.playerService}
        />
      )
    case 'Events':
      return (
        <CrudEditor
          fields={[{ name: 'title', type: 'string' }]}
          service={services.current.eventService}
        />
      )
    case 'Streams':
      return (
        <CrudEditor
          fields={[
            { name: 'title', type: 'string' },
            { name: 'url', type: 'string' },
            { name: 'date', type: 'string' },
            {
              name: 'eventId',
              type: 'ref',
              service: services.current.eventService,
              displayFieldName: 'title'
            }
          ]}
          service={services.current.streamService}
        />
      )

    default:
      router.replace('Home')
      return null
  }
}

export default App
