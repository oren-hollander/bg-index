import { CRUDService } from './crud.ts'
import { Event } from './event.ts'
import { Player } from './player.ts'
import { Stream } from './stream.ts'
import { Match } from './match.ts'

export interface Services {
  eventService: CRUDService<Event>
  streamService: CRUDService<Stream>
  playerService: CRUDService<Player>
  matchService: CRUDService<Match>
}
