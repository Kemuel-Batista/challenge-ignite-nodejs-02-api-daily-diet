import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knexdb } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionTokenExists } from '../middlewares/check-session-token-exists'

export async function DietRoutes(app: FastifyInstance) {
  // listar todas as refeições de um usuário
  app.get(
    '/',
    {
      preHandler: [checkSessionTokenExists],
    },
    async (request) => {
      // Exibir todas as dietas do usuário que não estejam deletadas pelo o mesmo
      const diets = await knexdb('diet')
        .where('user_id', request.user)
        .select()
        .whereNull('deleted_at')

      return {
        diets,
      }
    },
  )
  // visualizar uma única refeição
  app.get(
    '/:id',
    {
      preHandler: [checkSessionTokenExists],
    },
    async (request, reply) => {
      const getIdParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getIdParamsSchema.parse(request.params)

      const diet = await knexdb('diet')
        .where('id', id)
        .andWhere('user_id', request.user)
        .select()
        .whereNull('deleted_at')
        .first()

      if (!diet) {
        return reply.status(404).send({
          error: 'Not found snack with this id',
        })
      }

      return {
        diet,
      }
    },
  )
  // Métricas do usuário logado
  app.get(
    '/summary',
    {
      preHandler: [checkSessionTokenExists],
    },
    async (request) => {
      const totalSnacks = await knexdb('diet')
        .where('user_id', request.user)
        .count('id', { as: 'total' })
        .first()
        .whereNull('deleted_at')
        .then((result) => result?.total || 0)

      const totalSnacksOnDiet = await knexdb('diet')
        .where('user_id', request.user)
        .andWhere('is_on_diet', true)
        .whereNull('deleted_at')
        .count('id', { as: 'on_diet' })
        .first()
        .then((result) => result?.on_diet || 0)

      const totalSnacksOutOfDiet = await knexdb('diet')
        .where('user_id', request.user)
        .andWhere('is_on_diet', false)
        .whereNull('deleted_at')
        .count('id', { as: 'out_diet' })
        .first()
        .then((result) => result?.out_diet || 0)

      const meals = await knexdb('diet')
        .select('is_on_diet')
        .where('user_id', request.user)
        .whereNull('deleted_at')
        .orderBy('created_at')

      let currentSequence = 0
      let bestSequence = 0

      for (const meal of meals) {
        if (meal.is_on_diet) {
          currentSequence++
        } else {
          currentSequence = 0
        }

        if (currentSequence > bestSequence) {
          bestSequence = currentSequence
        }
      }

      const summary = {
        totalSnacks,
        totalSnacksOnDiet,
        totalSnacksOutOfDiet,
        bestSequence,
      }

      return {
        summary,
      }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkSessionTokenExists],
    },
    async (request, reply) => {
      const createDietBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string().max(8).min(8),
        time: z.string().max(4).min(4),
        isOnDiet: z.boolean(),
      })

      const { name, description, date, time, isOnDiet } =
        createDietBodySchema.parse(request.body)

      await knexdb('diet').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        user_id: request.user,
        date,
        time,
      })

      return reply.status(201).send()
    },
  )

  app.put('/:id', async (request, reply) => {
    const updateDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string().max(8).min(8),
      time: z.string().max(4).min(4),
      isOnDiet: z.boolean(),
    })

    const { name, description, date, time, isOnDiet } =
      updateDietBodySchema.parse(request.body)

    const getIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getIdParamsSchema.parse(request.params)

    await knexdb('diet')
      .update({
        name,
        description,
        date,
        time,
        is_on_diet: isOnDiet,
        updated_at: knexdb.fn.now(),
      })
      .where('id', id)
      .andWhere('user_id', request.user)

    return reply.status(201).send({
      message: 'Diet updated successfully!',
    })
  })

  app.delete('/:id', async (request, reply) => {
    const getIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getIdParamsSchema.parse(request.params)

    const snack = await knexdb('diet').where('id', id).select('*').first()

    if (!snack) {
      return reply
        .status(404)
        .send({ error: 'No such snack found with this id' })
    }

    if (snack.deleted_at !== null) {
      return reply
        .status(404)
        .send({ error: 'This snack has already been deleted' })
    }

    await knexdb('diet')
      .update('deleted_at', knexdb.fn.now())
      .where('id', id)
      .andWhere('user_id', request.user)

    return reply.status(201).send({
      message: 'Diet deleted successfully!',
    })
  })
}
