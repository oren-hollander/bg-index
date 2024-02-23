import { WithId } from './crud.ts'

export interface NewEvent {
  title: string
}

export type Event = WithId<NewEvent>
