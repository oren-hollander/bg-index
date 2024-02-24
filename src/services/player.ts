import { WithId } from './crud.ts'

export interface NewPlayer {
  fullName: string
  shortName: string
}

export type Player = WithId<NewPlayer>
