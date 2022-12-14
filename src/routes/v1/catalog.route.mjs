/* eslint-disable max-len */
import express from 'express'

import { catalogController } from '../../controllers/index.mjs'
import { verifyUser } from '../../middlewares/index.mjs'
import { api } from '../../constants/index.mjs'
import { permissions } from '../../config/permissions.mjs'

const {
  GET_CATALOGS,
  GET_CATALOG,
  CREATE_CATALOG,
  UPDATE_CATALOG,
  DETELE_CATALOG,
} = api.ENDPOINTS.CATALOG

const router = express.Router()

router.get(`/${GET_CATALOGS}`, catalogController.getCatalogues)
router.get(`/${GET_CATALOG}`, catalogController.getCatalog)
router.post(`/${CREATE_CATALOG}`, verifyUser(permissions.CATALOG.CREATE_CATALOG), catalogController.createCatalog)
router.patch(`/${UPDATE_CATALOG}`, verifyUser(permissions.CATALOG.UPDATE_CATALOG), catalogController.updateCatalog)
router.delete(`/${DETELE_CATALOG}`, verifyUser(permissions.CATALOG.DELETE_CATALOG), catalogController.deleteCatalog)

export default router
