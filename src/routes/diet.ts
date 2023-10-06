import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function DietRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createDietBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.date(),
      is_on_diet: z.boolean(),
    })

    // const { id } = request.jwtVerify()

    // console.log(id)
  })
}
