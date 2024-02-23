import { App, BSON, Credentials } from 'realm-web'
import { Match, NewMatch } from './match.ts'
import { Query } from '../search/query.ts'
import { isArray, isString } from 'lodash/fp'
import Filter = Realm.Services.MongoDB.Filter

export class MatchService {
  constructor(
    private readonly matchesCollection: Realm.Services.MongoDB.MongoDBCollection<Match>
  ) {}

  static async connect(credentials: Credentials): Promise<MatchService> {
    const app = new App({ id: 'bg-index-wsvuk' })

    const user = await app.logIn(credentials)
    const client = user.mongoClient('mongodb-atlas')
    const collection = client.db('bg-index').collection<Match>('matches')
    return new MatchService(collection)
  }

  async addMatch(match: NewMatch): Promise<void> {
    await this.matchesCollection.insertOne(match)
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const match = await this.matchesCollection.findOne({
      _id: BSON.ObjectId.createFromHexString(id)
    })

    return match ?? undefined
  }

  async query(query: Query): Promise<Match[]> {
    const filter: Filter = {}

    if (query.date?.from) {
      filter.$gte = query.date.from
    }

    if (query.date?.to) {
      filter.$lte = query.date.to
    }

    if (isString(query.players)) {
      filter.$or = [
        { 'players.top.full': { $regex: query.players, $options: 'i' } },
        { 'players.bottom.full': { $regex: query.players, $options: 'i' } }
      ]
    } else if (isArray(query.players)) {
      filter.$or = [
        {
          'players.top.full': { $regex: query.players[0], $options: 'i' },
          'players.bottom.full': { $regex: query.players[1], $options: 'i' }
        },
        {
          'players.top.full': { $regex: query.players[1], $options: 'i' },
          'players.bottom.full': { $regex: query.players[0], $options: 'i' }
        }
      ]
    }

    if (query.stream) {
      filter.stream = { $regex: query.stream, $options: 'i' }
    }

    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' }
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
