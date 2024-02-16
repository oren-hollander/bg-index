import { test } from 'vitest'
import { App, Credentials, BSON } from 'realm-web'
import { Match } from './matches/match.ts'

test.skip('atlas', async () => {
  const app = new App({ id: 'bg-index-wsvuk' })

  const credentials = Credentials.anonymous()
  const user = await app.logIn(credentials)
  console.assert(user.id === app.currentUser?.id)
  console.log(user.accessToken)

  const mongo = app.currentUser!.mongoClient('mongodb-atlas')
  const collection = mongo
    .db('bg-index')
    .collection<{ _id: BSON.ObjectID } & Match>('matches')

  const r = await collection.findOne()
  console.log(r?._id.toHexString())
  console.log(r)
})
