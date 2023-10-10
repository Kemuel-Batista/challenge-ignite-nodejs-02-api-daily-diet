import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knexdb } from '../database'

export async function AuthRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createAuthBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })

    const { email, password } = createAuthBodySchema.parse(request.body)

    const user = await knexdb('users')
      .where({
        email,
        password,
      })
      .first()

    if (!user) {
      return reply.status(404).send('User not found')
    }

    const userId = {
      id: user.id,
    }

    const token = app.jwt.sign(userId)

    return reply.status(200).send({ token })
  })
}
