import express from 'express'

import { authController } from '../../controllers/index.mjs'
import { validate } from '../../middlewares/index.mjs'
import { auth } from '../../validations/index.mjs'

const router = express.Router()

router.post('/register', validate(auth.register), authController.register)

export default router
