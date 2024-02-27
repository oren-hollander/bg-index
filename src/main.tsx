import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { Store } from '@tanstack/store'

interface State {
  signedIn: boolean
}

export const store = new Store<State>({ signedIn: false })

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
