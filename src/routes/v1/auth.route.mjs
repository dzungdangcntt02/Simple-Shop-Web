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
  FIND_ACCOUNT,
  RESETPW_EMAIL,
  VALIDATE_PWCODE,
  RESET_PASSWORD,
  REFRESH_TOKEN,
  LOGOUT,
} = api.ENDPOINTS.AUTH

const router = express.Router()
router.post(`/${REGISTER}`, validate(auth.register), authController.register)
router.post(`/${LOGIN}`, validate(auth.login), authController.login)
router.post(`/${FIND_ACCOUNT}`, validate(auth.findAccount), authController.findAccount)
router.post(`/${RESETPW_EMAIL}`, validate(auth.sendResetPwMail), authController.sendResetPwMail)
router.post(`/${VALIDATE_PWCODE}`, validate(auth.checkResetPwCode), authController.checkResetPwCode)
router.post(`/${RESET_PASSWORD}`, validate(auth.resetPassword), authController.resetPassword)
router.post(`/${REFRESH_TOKEN}`, validate(auth.refreshToken), authController.refreshToken)
router.post(`/${LOGOUT}`, validate(auth.logout), authController.logout)

router.post(`/${TEST}`, verifyUser(permissions.USER.CREATE_USER), authController.test)
router.post(`/${TEST}/:userId`, verifyUser(permissions.USER.READ_USER), authController.test)
router.post(`/${TEST}/:userId`, verifyUser(permissions.USER.READ_USER, permissions.USER.UPDATE_USER), authController.test)

export default router
