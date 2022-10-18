/* eslint-disable */
import request from 'supertest'
import slugify from 'slugify'
import { faker } from '@faker-js/faker/locale/vi'
import app from '../../app.mjs'
import setupTestDB from '../helpers/connectDb.mjs'
import { User } from '../../src/models/user.model.mjs'
import { insertUsers, userOne } from '../fixtures/user.fixture.mjs'
import { api, status } from '../../src/constants/index.mjs'
import { tokenService } from '../../src/services/index.mjs'

const { SUB_AUTH, AUTH, API_V1 } = api
const { REGISTER, LOGIN, VALIDATE_EMAIL } = SUB_AUTH
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

    it('should return 400 bad request since not contains email, password, username', async () => {
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
          expiresIn: expect.anything(),
        },
        refresh: {
          token: expect.anything(),
          expiresIn: expect.anything(),
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
          expiresIn: expect.anything(),
        },
        refresh: {
          token: expect.anything(),
          expiresIn: expect.anything(),
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

  // Test validate email API
  describe(`POST ${API_V1}${AUTH}/${VALIDATE_EMAIL}`, () => {

    let inactiveUser
    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      inactiveUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.INACTIVE,
      }
      await insertUsers([inactiveUser])
    })

    it('should return 200 if email sent', async () => {
      const res = await request(app).post(`${API_V1}${AUTH}/${VALIDATE_EMAIL}`).send({ email: inactiveUser.email })
      expect(res.statusCode).toBe(200)
    })

    it('should return 204 if email already exist in mailbox', async () => {
      await request(app).post(`${API_V1}${AUTH}/${VALIDATE_EMAIL}`).send({ email: inactiveUser.email })
      const nextRes = await request(app).post(`${API_V1}${AUTH}/${VALIDATE_EMAIL}`).send({ email: inactiveUser.email })
      expect(nextRes.statusCode).toBe(204)
    })

    // TODO Solve problem: how to fast-forward to 5 minutes later to test expired token in calling API
    // it('should return 201 when send new email after 5 minutes expired token', async () => {
    //
    // })

    it('should return 400 if email is not a valid email', async () => {
      const res = await request(app).post(`${API_V1}${AUTH}/${VALIDATE_EMAIL}`).send({ email: 'invalid email' })
      expect(res.statusCode).toBe(400)
    })

    it('should return 400 if email not exists', async () => {
      const res = await request(app).post(`${API_V1}${AUTH}/${VALIDATE_EMAIL}`).send({ email: 'fakemail@gmail.com' })
      expect(res.statusCode).toBe(400)
    })

    it('should return 403 if user is already active or banned', async () => {
      const user = await User.findOneAndUpdate({ email: inactiveUser.email }, { status: status.ACTIVE })

      const res1 = await request(app).post(`${API_V1}${AUTH}/${VALIDATE_EMAIL}`).send({ email: user.email })
      expect(res1.statusCode).toBe(403)

      await User.updateOne({ id: user._id }, { status: status.BANNED })
      const res2 = await request(app).post(`${API_V1}${AUTH}/${VALIDATE_EMAIL}`).send({ email: user.email })
      expect(res2.statusCode).toBe(403)
    })

  })

  // Test confirm account API
  describe(`POST /api/v1/auth/${VALIDATE_EMAIL}/t=:token`, () => {
    let inactiveUser
    let user
    let activateToken

    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      inactiveUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.INACTIVE,
      }
      user = await User.create(inactiveUser)
      activateToken = tokenService.generateValAccToken(user._id)
      user.activateToken = activateToken
      await user.save()
    })

    afterEach(async () => {
      user.activateToken = undefined
      await user.save()
    })

    it('should return 200 if status of user is inactive, token existed and valid', async () => {
      const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=${activateToken}`)
      expect(res.statusCode).toBe(200)
    })

    // TODO fast-forward time until token expired to test API
    // it('should return 401 if token is expired', async () => {
    //   const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=${activateToken}`)
    // })

    it('should return 401 if token is malformed', async () => {
      const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=malformed_token`)
      expect(res.statusCode).toBe(401)
    })

    it('should return 403 if token not exists', async () => {
      user.activateToken = undefined
      await user.save()
      const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=${activateToken}`)
      expect(res.statusCode).toBe(403)
    })

    it('should return 403 if status user is active', async () => {
      user.status = status.ACTIVE
      await user.save()
      const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=${activateToken}`)
      expect(res.statusCode).toBe(403)
    })

    it('should return 403 if status user is banned', async () => {
      user.status = status.BANNED
      await user.save()
      const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=${activateToken}`)
      expect(res.statusCode).toBe(403)
    })

    it('should return 404 if token is not provided in URL', async () => {
      const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=`)
      expect(res.statusCode).toBe(404)
    })

  })

})

