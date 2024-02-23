import { App, Credentials } from 'realm-web'
import MongoDBDatabase = Realm.Services.MongoDBDatabase

export const getDatabase = async (
  credentials: Credentials
): Promise<MongoDBDatabase> => {
  const app = new App({ id: 'bg-index-wsvuk' })
  const user = await app.logIn(credentials)
  const client = user.mongoClient('mongodb-atlas')
  return client.db('bg-index')
}
