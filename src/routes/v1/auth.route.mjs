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
  FIND_ACCOUNT,
  RESETPW_EMAIL,
} = api.ENDPOINTS.AUTH

const router = express.Router()
router.post(`/${REGISTER}`, validate(auth.register), authController.register)
router.post(`/${LOGIN}`, validate(auth.login), authController.login)
router.post(`/${VALIDATE_EMAIL}`, validate(auth.confirmEmail), authController.sendValidationEmail)
router.get(`/${VALIDATE_EMAIL}/t=:token`, validate(auth.confirmAccount), authController.confirmAccount)
router.post(`/${FIND_ACCOUNT}`, validate(auth.findAccount), authController.findAccount)
router.post(`/${RESETPW_EMAIL}`, validate(auth.sendResetPwMail), authController.sendResetPwMail)
router.post(`/${TEST}`, verifyUser(permissions.USER.CREATE_USER), authController.test)
router.post(`/${TEST}/:userId`, verifyUser(permissions.USER.READ_USER), authController.test)
router.post(`/${TEST}/:userId`, verifyUser(permissions.USER.READ_USER, permissions.USER.UPDATE_USER), authController.test)

export default router
