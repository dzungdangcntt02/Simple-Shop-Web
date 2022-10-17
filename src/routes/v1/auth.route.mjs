/* eslint-disable max-len */
import express from 'express'

import { authController } from '../../controllers/index.mjs'
import { validate, verifyUser } from '../../middlewares/index.mjs'
import { auth } from '../../validations/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  LOGIN,
  REGISTER,
  TEST,
  VALIDATE_EMAIL,
} = api.SUB_AUTH

const router = express.Router()
router.post(`/${REGISTER}`, validate(auth.register), authController.register)
router.post(`/${LOGIN}`, validate(auth.login), authController.login)
router.post(`/${VALIDATE_EMAIL}`, validate(auth.confirmEmail), authController.sendValidationEmail)
router.get(`/${VALIDATE_EMAIL}/t=:token`, validate(auth.confirmAccount), authController.confirmAccount)
router.post(`/${TEST}`, verifyUser(permissions.USER.CREATE_USER), authController.test)
router.post(`/${TEST}/:userId`, verifyUser(permissions.USER.READ_USER), authController.test)
router.post(`/${TEST}/:userId`, verifyUser(permissions.USER.READ_USER, permissions.USER.UPDATE_USER), authController.test)

export default router

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   $ref: '#/components/schemas/Token'
 *       "400":
 *         $ref: '#components/responses/DuplicatingEmail'
 *       "500":
 *         $ref: '#components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/v1/auth/sign-in:
 *   post:
 *     summary: Login as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   $ref: '#/components/schemas/Token'
 *       "401":
 *         $ref: '#components/responses/Unauthorized'
 *       "500":
 *         $ref: '#components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/v1/auth/confirm-email:
 *   post:
 *     summary: Send email to verify user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "200":
 *         description: Send email successfully
 *         content:
 *           application/json:
 *             example:
 *               code: 200,
 *               message: Email sent
 *               data: []
 *       "201":
 *         description: Resend email successfully
 *         content:
 *           application/json:
 *             example:
 *               code: 201
 *               message: New email sent
 *               data: []
 *       "204":
 *         description: Email already exists in mailbox with valid token
 *         content:
 *           application/json:
 *             example:
 *               code: 204,
 *               message: Email already exist. Check mailbox
 *               data: []
 *       "400":
 *         description: Email not exists
 *         content:
 *           application/json:
 *             example:
 *               code: 400
 *               message: Email not exists
 *               data: []
 *       "403":
 *         description: Can not activate active or banned account
 *         content:
 *           application/json:
 *             example:
 *               code: 403
 *               message: Forbidden
 *               data: []
 *       "500":
 *         $ref: '#components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/v1/auth/confirm-email/t={token}:
 *   get:
 *     summary: Verify user by token
 *     tags: [Auth]
 *     description: Confirm user by token
 *     parameters:
 *       - name: token
 *         in: path
 *         description: Activate token of user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Activate user successfully, remove 'activateToken' of user
 *         content:
 *           application/json:
 *             example:
 *               code: 200,
 *               message: OK
 *               data: []
 *       "401":
 *         description: Invalid Token malformed or expired
 *         content:
 *           application/json:
 *             example:
 *               code: 400
 *               message: Invalid Token
 *               data: []
 *       "403":
 *         description: Forbidden since user dont have activateToken in db or user status != inactive
 *         content:
 *           application/json:
 *             example:
 *               code: 403
 *               message: Forbidden
 *               data: []
 *       "500":
 *         $ref: '#components/responses/InternalServerError'
 */
