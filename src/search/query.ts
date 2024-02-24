import { Services } from '../services/services.ts'
import { Match } from '../services/match.ts'
import { isArray, isUndefined } from 'lodash/fp'
import { BSON } from 'realm-web'
import Filter = Realm.Services.MongoDB.Filter
import ObjectId = BSON.ObjectId

export interface DateQuery {
  from?: string
  to?: string
}

export interface Query {
  event?: string
  stream?: string
  match?: string
  date?: DateQuery
  players?: [string, string] | string
}

const getEventFilter = (event: string | undefined): Filter => {
  const filter: Filter = {}

  if (event) {
    filter.title = { $regex: event, $options: 'i' }
  }

  return filter
}

const getStreamFilter = (
  stream: string | undefined,
  date: DateQuery | undefined,
  eventIds: ObjectId[] | undefined
): Filter => {
  const filter: Filter = {}

  if (date?.from && date?.to) {
    filter.$and = [{ date: { $gte: date.from } }, { date: { $lte: date.to } }]
  } else if (date?.from) {
    filter.date = { $gte: date.from }
  } else if (date?.to) {
    filter.date = { $lte: date.to }
  }

  if (stream) {
    filter.title = { $regex: stream, $options: 'i' }
  }

  if (eventIds) {
    filter.eventId = { $in: eventIds }
  }

  return filter
}

const getPlayerId = async (
  services: Services,
  player: string
): Promise<ObjectId | undefined> => {
  const players = await services.playerService.query({
    $or: [
      { fullName: { $regex: player, $options: 'i' } },
      { shortName: { $regex: player, $options: 'i' } }
    ]
  })

  return players.length > 0 ? players[0]._id : undefined
}

const getMatchFilter = (
  playerIds: [ObjectId, ObjectId] | ObjectId | undefined,
  match: string | undefined,
  streamIds: ObjectId[] | undefined
): Filter => {
  const filter: Filter = {}

  if (!isUndefined(playerIds)) {
    if (isArray(playerIds)) {
      filter.$or = [
        {
          'playerIds.top': playerIds[0],
          'playerIds.bottom': playerIds[1]
        },
        {
          'playerIds.top': playerIds[1],
          'playerIds.bottom': playerIds[0]
        }
      ]
    } else {
      filter.$or = [
        { 'playerIds.top': playerIds },
        { 'playerIds.bottom': playerIds }
      ]
    }
  }

  if (match) {
    filter.title = { $regex: match, $options: 'i' }
  }

  if (streamIds) {
    filter.streamId = { $in: streamIds }
  }

  return filter
}

const queryEvents = async (
  services: Services,
  query: Query
): Promise<ObjectId[] | undefined> => {
  if (query.event) {
    const filter = getEventFilter(query.event)
    const events = await services.eventService.query(filter)
    return events.map(event => event._id)
  }
}

const queryStreams = async (
  services: Services,
  query: Query
): Promise<ObjectId[] | undefined> => {
  const eventIds = await queryEvents(services, query)

  if (query.stream || query.date || eventIds) {
    const filter = getStreamFilter(query.stream, query.date, eventIds)
    const streams = await services.streamService.query(filter)
    return streams.map(stream => stream._id)
  }
}

const queryPlayers = async (
  services: Services,
  players: [string, string] | string | undefined
): Promise<[ObjectId, ObjectId] | ObjectId | undefined> => {
  if (players) {
    if (isArray(players)) {
      const player1Ids = await getPlayerId(services, players[0])
      const player2Ids = await getPlayerId(services, players[1])
      if (player1Ids && player2Ids) {
        return [player1Ids, player2Ids]
      }
    } else {
      return getPlayerId(services, players)
    }
  }
}

export const queryMatches = async (
  services: Services,
  query: Query
): Promise<Match[]> => {
  const streamIds = await queryStreams(services, query)
  const playerIds = await queryPlayers(services, query.players)

  const filter = getMatchFilter(playerIds, query.match, streamIds)

  return services.matchService.query(filter, {
    sort: { title: 1 }
  })
}
