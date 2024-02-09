import { Search } from './search/Search.tsx'
import { router } from './router.ts'
import { Viewer } from './viewer/Viewer.tsx'

function App() {
  const route = router.useRoute(['Home', 'Match'])

  switch (route?.name) {
    case 'Home':
      return <Search />
    case 'Match':
      return <Viewer matchId={route.params.matchId} />
  }
}

export default App
