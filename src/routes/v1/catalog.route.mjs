/* eslint-disable max-len */
import express from 'express'

import { catalogController } from '../../controllers/index.mjs'
import { verifyUser } from '../../middlewares/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  GET_CATALOGS,
  // GET_CATALOG,
  // CREATE_CATALOG,
  // UPDATE_CATALOG,
  // DETELE_CATALOG,
} = api.ENDPOINTS.CATALOG

const router = express.Router()

router.get(`/${GET_CATALOGS}`, verifyUser(permissions.CATALOG.GET_CATALOGS), catalogController.getCatalogues)

export default router
