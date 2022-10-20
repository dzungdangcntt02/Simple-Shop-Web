import express from 'express';

import { api } from '../../constants/index.mjs'
import { config } from '../../validations/index.mjs';
import authEndpoint from './auth.route.mjs'
import docsEndpoint from './docs.route.mjs'

const router = express.Router()

const publicRoutes = [
  {
    path: `/${api.ENDPOINTS.AUTH.BASE}`,
    route: authEndpoint,
  },
]

const devRoutes = [
  {
    path: `/${api.ENDPOINTS.AUTH.DOCS}`,
    route: docsEndpoint,
  },
]

publicRoutes.forEach(route => {
  router.use(route.path, route.route)
})

if (config.nodeEnv === 'development') {
  devRoutes.forEach(route => {
    router.use(route.path, route.route)
  })
}

export default router
