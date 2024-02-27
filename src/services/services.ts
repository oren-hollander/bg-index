import { CRUDService } from './crud.ts'
import { Event } from './event.ts'
import { Player } from './player.ts'
import { Stream } from './stream.ts'
import { Match } from './match.ts'
import { AuthService } from './authService.ts'
import { createContext, useContext } from 'react'

export interface Services {
  authService: AuthService
  eventService: CRUDService<Event>
  streamService: CRUDService<Stream>
  playerService: CRUDService<Player>
  matchService: CRUDService<Match>
}

const ServicesContext = createContext<Services>(null as unknown as Services)

export const ServicesProvider = ServicesContext.Provider
export const useServices = (): Services => useContext(ServicesContext)

export const usePlayerService = (): CRUDService<Player> =>
  useServices().playerService

export const useMatchService = (): CRUDService<Match> =>
  useServices().matchService

export const useAuthService = (): AuthService => useServices().authService
