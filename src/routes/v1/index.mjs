import express from 'express';

import { api } from '../../constants/index.mjs'
import { config } from '../../validations/index.mjs';
import authEndpoint from './auth.route.mjs'
import sseEndpoint from './sse.route.mjs'
import userEndpoint from './user.route.mjs'
import docsEndpoint from './docs.route.mjs'
import testEndpoint from './test.route.mjs'
import brandEndpoint from './brand.route.mjs'
import catalogEndpoint from './catalog.route.mjs'
import transactionEndpoint from './transaction.route.mjs'
// import orderEndpoint from './order.route.mjs'
import productEndpoint from './product.route.mjs'

const router = express.Router()

const publicRoutes = [
  {
    path: `/${api.ENDPOINTS.AUTH.BASE}`,
    route: authEndpoint,
  },
  {
    path: `/${api.ENDPOINTS.SSE.BASE}`,
    route: sseEndpoint,
  },
  {
    path: '/test',
    route: testEndpoint,
  },
]

const defaultRoutes = [
  {
    path: `/${api.ENDPOINTS.USER.BASE}`,
    route: userEndpoint,
  },
  {
    path: `/${api.ENDPOINTS.PRODUCT.BASE}`,
    route: productEndpoint,
  },
  {
    path: `/${api.ENDPOINTS.BRAND.BASE}`,
    route: brandEndpoint,
  },
  {
    path: `/${api.ENDPOINTS.CATALOG.BASE}`,
    route: catalogEndpoint,
  },
  {
    path: `/${api.ENDPOINTS.TRANSACTION.BASE}`,
    route: transactionEndpoint,
  },
]

const devRoutes = [
  {
    path: `/${api.ENDPOINTS.DOCS.BASE}`,
    route: docsEndpoint,
  },
]

publicRoutes.forEach(route => {
  router.use(route.path, route.route)
})
defaultRoutes.forEach(route => {
  router.use(route.path, route.route)
})

if (config.nodeEnv === 'development') {
  devRoutes.forEach(route => {
    router.use(route.path, route.route)
  })
}

export default router
