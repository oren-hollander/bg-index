import React, { FC, useEffect, useState } from 'react'
import { Services, ServicesProvider } from './services/services.ts'
import { AuthService } from './services/authService.ts'
import { CRUDService } from './services/crud.ts'
import { ChakraProvider } from '@chakra-ui/react'
import Routing from './Routing.tsx'
import { store } from './main.tsx'

export const App: FC = () => {
  const [services, setServices] = useState<Services>()

  useEffect(() => {
    const init = async () => {
      const authService = await AuthService.create()
      store.setState(() => ({ signedIn: authService.isSignedIn() }))

      setServices({
        authService,
        eventService: new CRUDService('events', authService),
        playerService: new CRUDService('players', authService),
        matchService: new CRUDService('matches', authService),
        streamService: new CRUDService('streams', authService)
      })
    }
    init().catch(console.error)
  }, [])

  return (
    services && (
      <ServicesProvider value={services}>
        <React.StrictMode>
          <ChakraProvider>
            <Routing />
          </ChakraProvider>
        </React.StrictMode>
      </ServicesProvider>
    )
  )
}
