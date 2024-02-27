import { BSON } from 'realm-web'
import { AuthService } from './authService.ts'
import ObjectId = BSON.ObjectId
import Filter = Realm.Services.MongoDB.Filter
import Update = Realm.Services.MongoDB.Update
import FindOptions = Realm.Services.MongoDB.FindOptions
import AggregatePipelineStage = Realm.Services.MongoDB.AggregatePipelineStage

export interface HasId {
  _id: ObjectId
}

export type WithId<T> = T & HasId
export type WithoutId<T extends WithId<unknown>> = Omit<T, '_id'>

export class CRUDService<T extends HasId> {
  constructor(
    private readonly collectionName: string,
    private readonly authService: AuthService
  ) {}

  private get collection() {
    return this.authService.getDatabase().collection(this.collectionName)
  }

  query(filter?: Filter, options?: FindOptions): Promise<T[]> {
    return this.collection.find(filter, options)
  }

  aggregate(pipeline: AggregatePipelineStage[]): Promise<T[]> {
    return this.collection.aggregate(pipeline)
  }

  async add(document: WithoutId<T>): Promise<ObjectId> {
    const result = await this.collection.insertOne(document)
    return result.insertedId
  }

  async replace(document: T): Promise<void> {
    await this.collection.findOneAndReplace({ _id: document._id }, document)
  }

  async update(filter: Filter, update: Update): Promise<void> {
    await this.collection.updateOne(filter, update)
  }

  async get(id: ObjectId): Promise<T | undefined> {
    const document = await this.collection.findOne({ _id: id })
    return document ?? undefined
  }
}
