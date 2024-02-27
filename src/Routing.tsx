import { router } from './router.ts'
import { Viewer } from './viewer/Viewer.tsx'
import { CreateMatch } from './contribute/CreateMatch.tsx'
import { EditMatch } from './contribute/EditMatch.tsx'
import { CrudEditor } from './contribute/CrudEditor.tsx'
import { BSON } from 'realm-web'
import { FC } from 'react'
import { Search } from './search/Search.tsx'
import { useServices } from './services/services.ts'
import ObjectId = BSON.ObjectId
import { Login } from './Login.tsx'
import { store } from './main.tsx'
import { useStore } from '@tanstack/react-store'
import { Redirect } from './Redirect.tsx'

const Routing: FC = () => {
  const services = useServices()
  const signedIn = useStore(store, state => state.signedIn)

  const route = router.useRoute([
    'Home',
    'Login',
    'Match',
    'CreateMatch',
    'EditMatch',
    'Players',
    'Events',
    'Streams'
  ])

  switch (route?.name) {
    case 'Login':
      return <Login />
    case 'Home':
      return <Search />
    case 'Match':
      return (
        <Viewer matchId={ObjectId.createFromHexString(route.params.matchId)} />
      )
    case 'CreateMatch':
      if (signedIn) {
        return <CreateMatch />
      } else {
        return <Redirect route="Login" />
      }

    case 'EditMatch':
      if (signedIn) {
        return (
          <EditMatch
            matchId={ObjectId.createFromHexString(route.params.matchId)}
          />
        )
      } else {
        return <Redirect route="Login" />
      }

    case 'Players':
      return (
        <CrudEditor
          fields={[
            { name: 'fullName', type: 'string' },
            { name: 'shortName', type: 'string' }
          ]}
          service={services.playerService}
        />
      )
    case 'Events':
      return (
        <CrudEditor
          fields={[{ name: 'title', type: 'string' }]}
          service={services.eventService}
        />
      )
    case 'Streams':
      return (
        <CrudEditor
          fields={[
            { name: 'title', type: 'string' },
            { name: 'url', type: 'string' },
            { name: 'date', type: 'date' },
            {
              name: 'eventId',
              title: 'Event',
              type: 'ref',
              service: services.eventService,
              displayFieldName: 'title'
            }
          ]}
          service={services.streamService}
        />
      )

    case undefined:
      return <Redirect route="Home" />
  }
}

export default Routing
