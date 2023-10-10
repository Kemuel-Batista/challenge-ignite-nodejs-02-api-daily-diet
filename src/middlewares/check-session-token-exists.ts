import { VerifyPayloadType } from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../app'

type JwtPayload = VerifyPayloadType & {
  id: string
}

export async function checkSessionTokenExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization?.split(' ')[1]

  if (!token) {
    return reply.status(401).send({
      error: 'Unathourized',
    })
  }

  const decoded = app.jwt.verify<JwtPayload>(token)

  request.user = decoded.id
}
