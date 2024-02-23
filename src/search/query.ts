interface DateQuery {
  from: Date
  to: Date
}

export interface Query {
  stream?: string
  title?: string
  date?: DateQuery
  players?: [string, string] | string
  targetScore?: number
}
