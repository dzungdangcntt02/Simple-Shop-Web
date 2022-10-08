/* eslint-disable */
import request from 'supertest'
import slugify from 'slugify'
import { faker } from '@faker-js/faker/locale/vi'

import app from '../../app.mjs'
import setupTestDB from '../helpers/connectDb.mjs'
import User from '../../src/models/index.mjs'
import { insertUsers, userOne } from '../fixtures/user.fixture.mjs'
import { api } from '../../src/constants/index.mjs'

const { SUB_AUTH, AUTH, API_V1 } = api
const { REGISTER, LOGIN } = SUB_AUTH
setupTestDB()

describe('Auth routes', () => {

  // Test register API
  describe(`POST ${API_V1}${AUTH}/${REGISTER}`, () => {
    let newUser
    let sluggedUsername
    // Create mock user
    beforeEach(() => {
      newUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'babysocute02',
      }
      sluggedUsername = slugify(newUser.username, { lower: true })
    })

    it('should throw 400 bad request since not contains email, password, username', async () => {
      const res1 = await request(app).post(`${API_V1}${AUTH}/${REGISTER}`)
      expect(res1.statusCode).toBe(400)
    })

    // Although expect a lot but only handle one message based on output api
    it('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post(`${API_V1}${AUTH}/${REGISTER}`).send(newUser)
      expect(res.statusCode).toBe(201)
      expect(res.body.data.user).not.toHaveProperty('password')
      expect(res.body.data.user).toEqual({
        id: expect.anything(),
        username: newUser.username,
        email: newUser.email,
        role: 'user',
        slug: sluggedUsername,
        status: 'inactive',
      })
      const dbNewUser = await User.findById({ _id: res.body.data.user.id })
      expect(dbNewUser).toBeDefined()
      // Check password must be hashed in database
      expect(dbNewUser.password).not.toBe(newUser.password)
      // Check dbNewUser must contain the form object below
      expect(dbNewUser).toMatchObject({
        username: newUser.username,
        email: newUser.email,
        role: 'user',
        status: 'inactive',
        slug: sluggedUsername,
      })
      expect(res.body.data.tokens).toEqual({
        access: {
          token: expect.anything(),
          expires: expect.anything(),
        },
        refresh: {
          token: expect.anything(),
          expires: expect.anything(),
        },
      })
    })

    it('should return 400 error if email is invalid', async () => {
      newUser.email = 'invalidEmail'
      const res = await request(app).post(`${API_V1}${AUTH}/${REGISTER}`).send(newUser)
      expect(res.statusCode).toBe(400)
    })

    it('should return 400 error if email is already existed', async () => {
      await insertUsers([userOne])
      newUser.email = userOne.email
      const res = await request(app).post(`${API_V1}${AUTH}/${REGISTER}`).send(newUser)
      expect(res.statusCode).toBe(400)
    })
  })

  // Test log-in API
  describe(`POST ${API_V1}${AUTH}/${LOGIN}`, () => {
    it('should return 200 and successfully validate user info', async () => {
      // Add userOne to testDB
      await insertUsers([userOne])
      // Login form with verified info
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      }
      const res = await request(app).post(`${API_V1}${AUTH}/${LOGIN}`).send(loginCredentials)
      expect(res.statusCode).toBe(200)
      expect(res.body.data.user).toEqual({
        id: expect.anything(),
        username: userOne.username,
        email: userOne.email,
        role: userOne.role,
        slug: userOne.slug,
        status: userOne.status,
      })
      expect(res.body.data.tokens).toEqual({
        access: {
          token: expect.anything(),
          expires: expect.anything(),
        },
        refresh: {
          token: expect.anything(),
          expires: expect.anything(),
        }
      })
    })

    it('should return 400 bad request that email required and password required', async () => {
      const res = await request(app).post(`${API_V1}${AUTH}/${LOGIN}`).send({
        email: '',
        password: '',
      })
      expect(res.body.code).toBe(400)
    })

    it('should return 401 if there are no users with that email', async () => {
      const res = await request(app).post(`${API_V1}${AUTH}/${LOGIN}`).send({
        email: 'wrong email',
        password: userOne.password,
      })
      expect(res.body.code).toBe(401)
    })

    it('should return 401 error if password is wrong', async () => {
      const res = await request(app).post(`${API_V1}${AUTH}/${LOGIN}`).send({
        email: userOne.email,
        password: 'wrong password',
      })
      expect(res.body.code).toBe(401)
    })

  })
})

