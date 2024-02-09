import { Search } from './search/Search.tsx'
import { router } from './router.ts'
import { Viewer } from './viewer/Viewer.tsx'
import { Capture } from './capture/Capture.tsx'

function App() {
  const route = router.useRoute(['Home', 'Match', 'Capture'])

  switch (route?.name) {
    case 'Home':
      return <Search />
    case 'Match':
      return <Viewer matchId={route.params.matchId} />
    case 'Capture':
      return <Capture />
  }
}

export default App
