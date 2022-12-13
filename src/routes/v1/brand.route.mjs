/* eslint-disable max-len */
import express from 'express'

import { brandController } from '../../controllers/index.mjs'
import { verifyUser } from '../../middlewares/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  GET_BRANDS,
  GET_BRAND,
  CREATE_BRAND,
  UPDATE_BRAND,
  DETELE_BRAND,
} = api.ENDPOINTS.BRAND

const router = express.Router()

router.get(`/${GET_BRANDS}`, brandController.getBrands)
router.get(`/${GET_BRAND}`, brandController.getBrand)
router.post(`/${CREATE_BRAND}`, verifyUser(permissions.BRAND.CREATE_BRAND), brandController.createBrand)
router.patch(`/${UPDATE_BRAND}`, verifyUser(permissions.BRAND.UPDATE_BRAND), brandController.updateBrand)
router.delete(`/${DETELE_BRAND}`, verifyUser(permissions.BRAND.DELETE_BRAND), brandController.deleteBrand)

export default router
