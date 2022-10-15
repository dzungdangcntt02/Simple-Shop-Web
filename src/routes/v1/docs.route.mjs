import { Router } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import { serve, setup } from 'swagger-ui-express'

import { swaggerDefinition } from '../../docs/swaggerDef.mjs'

const router = Router()

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/v1/*.mjs'],
})

router.use('/', serve)
router.get(
  '/',
  setup(specs, {
    explorer: true, // Allow to search
  }),
)

export default router
