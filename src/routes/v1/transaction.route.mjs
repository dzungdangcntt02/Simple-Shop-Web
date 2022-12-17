/* eslint-disable max-len */
import express from 'express'

import { transactionController } from '../../controllers/index.mjs'
// import { verifyUser } from '../../middlewares/index.mjs'
// import { user } from '../../validations/index.mjs'
import { api } from '../../constants/index.mjs'
// import { permissions } from '../../config/permissions.mjs'

const {
  CREATE_TRANSACTION,
} = api.ENDPOINTS.TRANSACTION

const { CLIENT } = api.ENDPOINTS

const router = express.Router()

// router.get(`/${ADMIN}/${GET_PRODUCT}`, verifyUser(permissions.PRODUCT.GET_PRODUCT), productController.getProduct)
// router.get(`/${ADMIN}/${GET_PRODUCTS}`, verifyUser(permissions.PRODUCT.GET_PRODUCTS), productController.getProducts)
// router.post(`/${ADMIN}/${CREATE_PRODUCT}`, verifyUser(permissions.PRODUCT.CREATE_PRODUCT), productController.createProduct)
// router.patch(`/${ADMIN}/${UPDATE_PRODUCT}`, verifyUser(permissions.PRODUCT.UPDATE_PRODUCT), productController.updateProduct)
// router.delete(`/${ADMIN}/${DELETE_PRODUCT}`, verifyUser(permissions.PRODUCT.DELETE_PRODUCT), productController.deleteProduct)

router.post(`/${CLIENT}/${CREATE_TRANSACTION}`, transactionController.createTransaction)

export default router
