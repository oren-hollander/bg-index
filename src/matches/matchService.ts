import { App, Credentials, BSON } from 'realm-web'
import { Match } from './match.ts'
import { Query } from '../search/search.ts'
import { isArray, isString, set } from 'lodash/fp'
import Filter = Realm.Services.MongoDB.Filter

export class MatchService {
  constructor(
    private readonly matchesCollection: Realm.Services.MongoDB.MongoDBCollection<Match>
  ) {}

  static async connect(): Promise<MatchService> {
    const app = new App({ id: 'bg-index-wsvuk' })

    const credentials = Credentials.anonymous()
    const user = await app.logIn(credentials)
    const client = user.mongoClient('mongodb-atlas')
    const collection = client.db('bg-index').collection<Match>('matches')
    return new MatchService(collection)
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const match = await this.matchesCollection.findOne({
      _id: BSON.ObjectId.createFromHexString(id)
    })

    return match ?? undefined
  }

  async query(query: Query): Promise<Match[]> {
    let dateFilter: Record<string, Date> = {}
    if (query.date?.from) {
      dateFilter = set('$gte', query.date.from, dateFilter)
    }

    if (query.date?.to) {
      dateFilter = set('$lte', query.date.to, dateFilter)
    }

    let playersFilter = {}
    if (isString(query.players)) {
      playersFilter = {
        $or: [
          { 'top.full': { $regex: query.players, $options: 'i' } },
          { 'bottom.full': { $regex: query.players, $options: 'i' } }
        ]
      }
    } else if (isArray(query.players)) {
      playersFilter = {
        $or: [
          {
            'top.full': { $regex: query.players[0], $options: 'i' },
            'bottom.full': { $regex: query.players[1], $options: 'i' }
          },
          {
            'top.full': { $regex: query.players[1], $options: 'i' },
            'bottom.full': { $regex: query.players[0], $options: 'i' }
          }
        ]
      }
    }

    const filter: Filter = {}

    if (query.title) {
      filter.title = query.title
    }

    if (query.date) {
      filter.date = dateFilter
    }

    if (query.players) {
      filter.players = playersFilter
    }

    if (query.targetScore) {
      filter.targetScore = query.targetScore
    }

    return this.matchesCollection.find(filter, {
      sort: {
        date: -1,
        stream: 1,
        title: 1
      }
    })
  }
}