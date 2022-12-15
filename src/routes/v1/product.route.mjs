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

const { ADMIN, CLIENT } = api.ENDPOINTS

const router = express.Router()

router.get(`/${ADMIN}/${GET_PRODUCT}`, verifyUser(permissions.PRODUCT.GET_PRODUCT), productController.getProduct)
router.get(`/${ADMIN}/${GET_PRODUCTS}`, verifyUser(permissions.PRODUCT.GET_PRODUCTS), productController.getProducts)
router.post(`/${ADMIN}/${CREATE_PRODUCT}`, verifyUser(permissions.PRODUCT.CREATE_PRODUCT), productController.createProduct)
router.patch(`/${ADMIN}/${UPDATE_PRODUCT}`, verifyUser(permissions.PRODUCT.UPDATE_PRODUCT), productController.updateProduct)
router.delete(`/${ADMIN}/${DELETE_PRODUCT}`, verifyUser(permissions.PRODUCT.DELETE_PRODUCT), productController.deleteProduct)

router.get(`/${CLIENT}/${GET_PRODUCTS}`, productController.getShortProductList)
router.post(`/${CLIENT}/${GET_PRODUCTS}`, productController.getShortProductList)
router.get(`/${CLIENT}/${GET_PRODUCT}`, productController.getProduct)

export default router
