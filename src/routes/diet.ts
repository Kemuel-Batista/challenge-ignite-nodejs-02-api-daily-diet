import { VerifyPayloadType } from '@fastify/jwt'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

type JwtPayload = VerifyPayloadType & {
  id: string
}

export async function DietRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const auth = request.headers.authorization

    if (!auth) {
      return reply.status(404).send('JWT Token not found')
    }

    const token = auth.split(' ')[1]

    const decoded = app.jwt.verify<JwtPayload>(token)

    const userId = decoded.id

    // Exibir todas as dietas do usuário que não estejam deletadas pelo o mesmo
    const diets = await knex('diet')
      .where('user_id', userId)
      .select()
      .whereNull('deleted_at')

    return {
      diets,
    }
  })

  app.post('/', async (request, reply) => {
    const createDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string().max(8).min(8),
      time: z.string().max(4).min(4),
      isOnDiet: z.boolean(),
    })

    const { name, description, date, time, isOnDiet } =
      createDietBodySchema.parse(request.body)

    const auth = request.headers.authorization

    if (!auth) {
      return reply.status(404).send('JWT Token not found')
    }

    const token = auth.split(' ')[1]

    const decoded = app.jwt.verify<JwtPayload>(token)

    const userId = decoded.id

    await knex('diet').insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      user_id: userId,
      date,
      time,
    })

    return reply.status(201).send()
  })
}
