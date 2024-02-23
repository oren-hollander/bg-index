import { CRUDService } from './crud.ts'
import { Event } from './events.ts'
import { Player } from './players.ts'
import { MatchService } from './matchService.ts'
import { Stream } from './stream.ts'

export interface Services {
  events: CRUDService<Event>
  streams: CRUDService<Stream>
  players: CRUDService<Player>
  matches: MatchService
}
