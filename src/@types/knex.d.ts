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
      date: string
      time: string
      is_on_diet: boolean
      user_id: string | object | Buffer
      updated_at: Date | null
      deleted_at: Date | null
    }
  }
}
