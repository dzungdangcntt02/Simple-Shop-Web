/* eslint-disable max-len */
import express from 'express'

import { transactionController } from '../../controllers/index.mjs'
import { verifyUser } from '../../middlewares/index.mjs'
// import { user } from '../../validations/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  CREATE_TRANSACTION,
  GET_TRANSACTIONS,
  GET_TRANSACTION,
  UPDATE_TRANSACTION,
} = api.ENDPOINTS.TRANSACTION

const { ADMIN, CLIENT } = api.ENDPOINTS

const router = express.Router()

router.get(`/${ADMIN}/${GET_TRANSACTION}`, verifyUser(permissions.TRANSACTION.GET_TRANSACTION), transactionController.getTransaction)
router.get(`/${ADMIN}/${GET_TRANSACTIONS}`, verifyUser(permissions.TRANSACTION.GET_TRANSACTIONS), transactionController.getTransactions)
router.patch(`/${ADMIN}/${UPDATE_TRANSACTION}`, verifyUser(permissions.TRANSACTION.UPDATE_TRANSACTION), transactionController.updateTransaction)

router.post(`/${CLIENT}/${CREATE_TRANSACTION}`, transactionController.createTransaction)

export default router
