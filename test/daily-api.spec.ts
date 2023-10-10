import { it, beforeAll, afterAll, describe } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Daily API', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('User routes', () => {
    it('should be able to create a new user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'Kemuel',
          lastname: 'Batista',
          email: 'kemuellima20@gmail.com',
          password: '123456789',
          confirmPassword: '123456789',
        })
        .expect(201)
    })
  })

  describe('Auth routes', () => {
    it('should be able to login a user', async () => {
      await request(app.server)
        .post('/auth')
        .send({
          email: 'kemuellima20@gmail.com',
          password: '123456789',
        })
        .expect(200)
    })
  })

  describe('Diet routes', () => {
    it('should be able to create a new meal', async () => {
      const token = await request(app.server)
        .post('/auth')
        .send({
          email: 'kemuellima20@gmail.com',
          password: '123456789',
        })
        .expect(200)

      await request(app.server)
        .post('/diet')
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'Feijão com Arroz',
          description: '200g de feijão com 200g de arroz',
          date: '20231010',
          time: '0800',
          isOnDiet: true,
        })
        .expect(201)
    })

    it.todo('should be able to edit a meal')
    it.todo('should be able to delete a meal')
    it.todo('should be able to get all meals')
    it.todo('should be able to get specific meal')
    it.todo('should be able to get summary of logged user')
  })
})
