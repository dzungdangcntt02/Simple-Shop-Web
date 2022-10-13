import express from 'express';

import { api } from '../../constants/index.mjs'
import authEndpoint from './auth.route.mjs'

const router = express.Router()

const defaultRoutes = [
  {
    path: api.AUTH,
    route: authEndpoint,
  },
]

defaultRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
