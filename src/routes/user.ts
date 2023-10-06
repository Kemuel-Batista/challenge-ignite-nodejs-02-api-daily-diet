import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function UserRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z
      .object({
        name: z.string(),
        lastname: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
      .superRefine(({ password, confirmPassword }, ctx) => {
        if (confirmPassword !== password) {
          ctx.addIssue({
            code: 'custom',
            message: 'the passwords did not match',
          })
        }
      })

    const { name, lastname, email, password } = createUserBodySchema.parse(
      request.body,
    )

    await knex('users').insert({
      id: randomUUID(),
      name,
      lastname,
      email,
      password,
    })

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const users = await knex('users').select('*')

    return {
      users,
    }
  })
}
