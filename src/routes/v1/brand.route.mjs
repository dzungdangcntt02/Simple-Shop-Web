/* eslint-disable max-len */
import express from 'express'

import { brandController } from '../../controllers/index.mjs'
import { verifyUser } from '../../middlewares/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  GET_BRANDS,
  // GET_BRAND,
  // CREATE_BRAND,
  // UPDATE_BRAND,
  // DETELE_BRAND,
} = api.ENDPOINTS.BRAND

const router = express.Router()

router.get(`/${GET_BRANDS}`, verifyUser(permissions.BRAND.GET_BRANDS), brandController.getBrands)

export default router
