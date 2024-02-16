import { Search } from './search/Search.tsx'
import { router } from './router.ts'
import { Viewer } from './viewer/Viewer.tsx'
import { Contribute } from './contribute/Contribute.tsx'

function App() {
  const route = router.useRoute(['Home', 'Match', 'Contribute'])

  switch (route?.name) {
    case 'Home':
      return <Search />
    case 'Match':
      return <Viewer matchId={route.params.matchId} />
    case 'Contribute':
      return <Contribute />
    default:
      router.replace('Home')
      return null
  }
}

export default App
