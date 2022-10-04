/* eslint-disable */
import request from 'supertest'
import { faker } from '@faker-js/faker/locale/vi'

import app from '../../app.mjs'
import setupTestDB from '../helpers/connectDb.mjs'

setupTestDB()

describe('Auth routes', () => {
  describe('POST /api/v1/auth/register', () => {
    let newUser
    // Create mock user
    beforeEach(() => {
      newUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'babysocute02',
      }
    })

    it('should throw an error since not contains email, password, username', async () => {
      const res1 = await request(app).post('/api/v1/auth/register')
      expect(res1.statusCode).toBe(400)
    })

    // Although expect a lot but only handle one message based on output api
    it('should return 201 and successfully register user if request data is ok', async () => {
      const res2 = await request(app).post('/api/v1/auth/register').send(newUser)
      expect(res2.statusCode).toBe(201)
      expect(res2.body.data.user).not.toHaveProperty('password')
    })

  })
})

