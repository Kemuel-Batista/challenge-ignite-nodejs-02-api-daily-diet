import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import { UserRoutes } from './routes/user'
import { AuthRoutes } from './routes/auth'
import { DietRoutes } from './routes/diet'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
})

app.register(AuthRoutes, {
  prefix: 'auth',
})

app.register(UserRoutes, {
  prefix: 'users',
})

app.register(DietRoutes, {
  prefix: 'diet',
})
