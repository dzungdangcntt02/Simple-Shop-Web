/* eslint-disable max-len */
import express from 'express'

import { productController } from '../../controllers/index.mjs'
import { verifyUser } from '../../middlewares/index.mjs'
// import { user } from '../../validations/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  GET_PRODUCTS,
  GET_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} = api.ENDPOINTS.PRODUCT

const router = express.Router()

router.get(`/${GET_PRODUCTS}`, productController.getProducts)
router.get(`/${GET_PRODUCT}`, productController.getProduct)
router.post(`/${CREATE_PRODUCT}`, verifyUser(permissions.PRODUCT.CREATE_PRODUCT), productController.createProduct)
router.patch(`/${UPDATE_PRODUCT}`, verifyUser(permissions.PRODUCT.UPDATE_PRODUCT), productController.updateProduct)
router.delete(`/${DELETE_PRODUCT}`, verifyUser(permissions.PRODUCT.DELETE_PRODUCT), productController.deleteProduct)

export default router
