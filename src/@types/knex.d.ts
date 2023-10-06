// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      lastname: string
      email: string
      password: string
    }
    diet: {
      id: string
      name: string
      description: string
      date: Date
      time: Date
      is_on_diet: boolean
      user_id: string
    }
  }
}
