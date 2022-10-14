/* eslint-disable max-len */
import express from 'express'

import { authController } from '../../controllers/index.mjs'
import { validate, verifyUser } from '../../middlewares/index.mjs'
import { auth } from '../../validations/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const { LOGIN, REGISTER, TEST } = api.SUB_AUTH

const router = express.Router()
router.post(`/${REGISTER}`, validate(auth.register), authController.register)
router.post(`/${LOGIN}`, validate(auth.login), authController.login)
router.post(`/${TEST}`, verifyUser(permissions.USER.CREATE_USER), authController.test)
router.post(`/${TEST}/:userId`, verifyUser(permissions.USER.READ_USER), authController.test)
// router.post(`/${TEST}/:userId`, verifyUser(permissions.USER.READ_USER, permissions.USER.UPDATE_USER), authController.test)

export default router

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
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
 * /auth/sign-in:
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
