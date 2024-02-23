import { WithId } from './crud.ts'
import { BSON } from 'realm-web'
import ObjectId = BSON.ObjectId

export interface NewStream {
  title: string
  url: string
  date: string
  eventId: ObjectId
}

export type Stream = WithId<NewStream>
