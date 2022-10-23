/* eslint-disable */
import request from 'supertest'
import slugify from 'slugify'
import { faker } from '@faker-js/faker/locale/vi'
import Jwt from 'jsonwebtoken'

import app from '../../app.mjs'
import setupTestDB from '../helpers/connectDb.mjs'
import { User } from '../../src/models/user.model.mjs'
import { insertUsers, userOne } from '../fixtures/user.fixture.mjs'
import { api, status, expireOTP } from '../../src/constants/index.mjs'
import { tokenService, userService } from '../../src/services/index.mjs'
import { config } from '../../src/validations/index.mjs'

const { ENDPOINTS, V1 } = api
const {
  REGISTER,
  LOGIN,
  VALIDATE_EMAIL,
  BASE,
  FIND_ACCOUNT,
  RESETPW_EMAIL,
  VALIDATE_PWCODE,
} = ENDPOINTS.AUTH

setupTestDB()

describe('Auth routes', () => {
  /*
    // Test register API
    describe(`POST ${V1}/${BASE}/${REGISTER}`, () => {
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
        const res1 = await request(app).post(`${V1}/${BASE}/${REGISTER}`)
        expect(res1.statusCode).toBe(400)
      })
  
      // Although expect a lot but only handle one message based on output api
      it('should return 201 and successfully register user if request data is ok', async () => {
        const res = await request(app).post(`${V1}/${BASE}/${REGISTER}`).send(newUser)
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
        const res = await request(app).post(`${V1}/${BASE}/${REGISTER}`).send(newUser)
        expect(res.statusCode).toBe(400)
      })
  
      it('should return 400 error if email is already existed', async () => {
        await insertUsers([userOne])
        newUser.email = userOne.email
        const res = await request(app).post(`${V1}/${BASE}/${REGISTER}`).send(newUser)
        expect(res.statusCode).toBe(400)
      })
    })
  */
  /*
    // Test log-in API
    describe(`POST ${V1}/${BASE}/${LOGIN}`, () => {
      it('should return 200 and successfully validate user info', async () => {
        await insertUsers([userOne])
        // Login form with verified info
        const loginCredentials = {
          email: userOne.email,
          password: userOne.password,
        }
        const res = await request(app).post(`${V1}/${BASE}/${LOGIN}`).send(loginCredentials)
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
        const res = await request(app).post(`${V1}/${BASE}/${LOGIN}`).send({
          email: '',
          password: '',
        })
        expect(res.body.code).toBe(400)
      })
  
      it('should return 401 if there are no users with that email', async () => {
        const res = await request(app).post(`${V1}/${BASE}/${LOGIN}`).send({
          email: 'wrong email',
          password: userOne.password,
        })
        expect(res.body.code).toBe(401)
      })
  
      it('should return 401 error if password is wrong', async () => {
        const res = await request(app).post(`${V1}/${BASE}/${LOGIN}`).send({
          email: userOne.email,
          password: 'wrong password',
        })
        expect(res.body.code).toBe(401)
      })
  
    })
  */
  /*
    // Test validate email API
    describe(`POST ${V1}/${BASE}/${VALIDATE_EMAIL}`, () => {
  
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
        const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_EMAIL}`).send({ email: inactiveUser.email })
        expect(res.statusCode).toBe(200)
      })
  
      it('should return 204 if email already exist in mailbox', async () => {
        await request(app).post(`${V1}/${BASE}/${VALIDATE_EMAIL}`).send({ email: inactiveUser.email })
        const nextRes = await request(app).post(`${V1}/${BASE}/${VALIDATE_EMAIL}`).send({ email: inactiveUser.email })
        expect(nextRes.statusCode).toBe(204)
      })
  
      // TODO Solve problem: how to fast-forward to 5 minutes later to test expired token in calling API
      // it('should return 201 when send new email after 5 minutes expired token', async () => {
      //
      // })
  
      it('should return 400 if email is not a valid email', async () => {
        const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_EMAIL}`).send({ email: 'invalid email' })
        expect(res.statusCode).toBe(400)
      })
  
      it('should return 400 if email not exists', async () => {
        const res = await request(app).post(`${V1}/${BASE}/${VALIDATE_EMAIL}`).send({ email: 'fakemail@gmail.com' })
        expect(res.statusCode).toBe(400)
      })
  
      it('should return 403 if user is already active or banned', async () => {
        const user = await User.findOneAndUpdate({ email: inactiveUser.email }, { status: status.ACTIVE })
  
        const res1 = await request(app).post(`${V1}/${BASE}/${VALIDATE_EMAIL}`).send({ email: user.email })
        expect(res1.statusCode).toBe(403)
  
        await User.updateOne({ id: user._id }, { status: status.BANNED })
        const res2 = await request(app).post(`${V1}/${BASE}/${VALIDATE_EMAIL}`).send({ email: user.email })
        expect(res2.statusCode).toBe(403)
      })
  
    })
  */
  /*
   // Test confirm account API
   describe(`POST ${V1}/${BASE}/${VALIDATE_EMAIL}/t=:token`, () => {
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
       const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=${activateToken}`)
       expect(res.statusCode).toBe(200)
     })
 
     // TODO fast-forward time until token expired to test API
     // it('should return 401 if token is expired', async () => {
     //   const res = await request(app).get(`/api/v1/auth/${VALIDATE_EMAIL}/t=${activateToken}`)
     // })
 
     it('should return 401 if token is malformed', async () => {
       const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=malformed_token`)
       expect(res.statusCode).toBe(401)
     })
 
     it('should return 403 if token not exists', async () => {
       user.activateToken = undefined
       await user.save()
       const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=${activateToken}`)
       expect(res.statusCode).toBe(403)
     })
 
     it('should return 403 if status user is active', async () => {
       user.status = status.ACTIVE
       await user.save()
       const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=${activateToken}`)
       expect(res.statusCode).toBe(403)
     })
 
     it('should return 403 if status user is banned', async () => {
       user.status = status.BANNED
       await user.save()
       const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=${activateToken}`)
       expect(res.statusCode).toBe(403)
     })
 
     it('should return 404 if token is not provided in URL', async () => {
       const res = await request(app).get(`${V1}/${BASE}/${VALIDATE_EMAIL}/t=`)
       expect(res.statusCode).toBe(404)
     })
 
   })
  */
  /*
  // Test find account API
  describe(`POST ${V1}/${BASE}/${FIND_ACCOUNT}`, () => {
    // Arrange
    let activeUser
    let user
    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      activeUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.ACTIVE,
      }
      user = await User.create(activeUser)
    })
    it('should return 200 with resetpw-mail token', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: activeUser.email })
      const { token } = res.body.data
      const { sub } = Jwt.verify(token, config.defaultTokenKey)
      const user = await userService.getUserById(sub)

      // Assert
      expect(res.statusCode).toBe(200)
      expect(token).toBeDefined()
      expect(user.findAccountToken).toEqual(token)
    })

    it('should return 400 if email not pass into request', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`)

      // Assert
      expect(res.statusCode).toBe(400)
    })

    it('should return 401 if email not exist', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: 'fake@example.com' })

      // Assert
      expect(res.statusCode).toBe(401)
    })

    it('should return 401 if email exists but account is inactive', async () => {
      // Act
      user.status = status.INACTIVE
      await user.save()
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: user.email })

      // Assert
      expect(res.statusCode).toBe(401)
    })
  })
  */
  /*
  // Test reset password send email API
  describe(`POST ${V1}/${BASE}/${RESETPW_EMAIL}`, () => {
    // Arrange
    let activeUser
    let user
    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      activeUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.ACTIVE,
      }
      user = await User.create(activeUser)
    })

    afterEach(async () => {
      user.findAccountToken = undefined
      await user.save()
    })

    it('should return 200 if successfully send email or resend email', async () => {
      const token = tokenService.generateToken({ sub: user._id }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins
      user.findAccountToken = token
      await user.save()
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token })
      const { resetPwCode, resetPwIssued } = await userService.getUserById(user._id)

      // Assert
      expect(res.statusCode).toBe(200)
      expect(resetPwCode).toHaveLength(6)
      expect(resetPwIssued).toBeDefined()
      expect(Date.now() - resetPwIssued).toBeGreaterThan(0) // reset pw code must be valid (have not expired) 
      expect(Date.now() - resetPwIssued).toBeLessThanOrEqual(expireOTP) // reset pw code must be valid (not greater than expires time) 
    })

    it('should return 400 if token not found', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`)

      // Assert
      expect(res.statusCode).toBe(400)
    })

    it('should return 401 if token not exist', async () => {
      const token = tokenService.generateToken({ sub: user._id }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token })

      expect(res.statusCode).toBe(401)
    })

    it('should return 401 if token invalid (malformed)', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token: 'invalid token' })

      expect(res.statusCode).toBe(401)
    })

    // TODO fast-forward token to expired
    // it('should return 401 if token invalid (expired or invalid signed)', async () => {
    //   const token = tokenService.generateToken({ sub: user._id }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins

    //   // Act
    //   const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token: 'invalid token'})

    //   expect(res.statusCode).toBe(401)
    // })

    it('should return 401 if user not exist', async () => {
      const randomId = '62f067b1a405b5affaf39694'
      const token = tokenService.generateToken({ sub: randomId }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${RESETPW_EMAIL}`).send({ token: token })

      // Assert
      expect(res.statusCode).toBe(401)
    })
  })
  */
  // Test validate password code API
  describe(`POST ${V1}/${BASE}/${VALIDATE_PWCODE}`, () => {
    // Arrange
    let activeUser
    let user
    beforeEach(async () => {
      const { role, status } = await import('../../src/constants/index.mjs')
      activeUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: role.USER,
        status: status.ACTIVE,
      }
      user = await User.create(activeUser)
    })
    it('should return 200 with resetpw-mail token', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: activeUser.email })
      const { token } = res.body.data
      const { sub } = Jwt.verify(token, config.defaultTokenKey)
      const user = await userService.getUserById(sub)

      // Assert
      expect(res.statusCode).toBe(200)
      expect(token).toBeDefined()
      expect(user.findAccountToken).toEqual(token)
    })

    it('should return 400 if email not pass into request', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`)

      // Assert
      expect(res.statusCode).toBe(400)
    })

    it('should return 401 if email not exist', async () => {
      // Act
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: 'fake@example.com' })

      // Assert
      expect(res.statusCode).toBe(401)
    })

    it('should return 401 if email exists but account is inactive', async () => {
      // Act
      user.status = status.INACTIVE
      await user.save()
      const res = await request(app).post(`${V1}/${BASE}/${FIND_ACCOUNT}`).send({ email: user.email })

      // Assert
      expect(res.statusCode).toBe(401)
    })
  })
})

