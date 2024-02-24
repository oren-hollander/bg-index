import { BSON } from 'realm-web'
import Collection = Realm.Services.MongoDB.MongoDBCollection
import ObjectId = BSON.ObjectId
import Filter = Realm.Services.MongoDB.Filter
import FindOptions = Realm.Services.MongoDB.FindOptions

export interface HasId {
  _id: ObjectId
}

export type WithId<T> = T & HasId
export type WithoutId<T extends WithId<unknown>> = Omit<T, '_id'>

export class CRUDService<T extends HasId> {
  constructor(private readonly collection: Collection<T>) {}

  list(): Promise<T[]> {
    return this.collection.find()
  }

  query(filter: Filter, options?: FindOptions): Promise<T[]> {
    return this.collection.find(filter, options)
  }

  async add(document: WithoutId<T>): Promise<void> {
    await this.collection.insertOne(document)
  }

  async replace(document: T): Promise<void> {
    await this.collection.findOneAndReplace({ _id: document._id }, document)
  }

  async get(id: ObjectId): Promise<T | undefined> {
    const document = await this.collection.findOne({ _id: id })
    return document ?? undefined
  }
}
