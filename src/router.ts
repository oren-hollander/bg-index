import { createRouter } from '@swan-io/chicane'

export const router = createRouter({
  Home: '/bg-index/',
  Login: '/bg-index/login',
  Match: '/bg-index/matches/:matchId',
  CreateMatch: '/bg-index/create-match',
  EditMatch: '/bg-index/edit-match/:matchId',
  Players: '/bg-index/players',
  Events: '/bg-index/events',
  Streams: '/bg-index/streams'
})

export type RouteNames = Parameters<typeof router.push>[0]
