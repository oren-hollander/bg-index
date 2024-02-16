import { createRouter } from '@swan-io/chicane'

export const router = createRouter({
  Home: '/bg-index/',
  Match: '/bg-index/matches/:matchId',
  Contribute: '/bg-index/contribute'
})
