import * as commonSchemas from './commonSchemas.mjs'
import * as userSchema from './userSchema.mjs'
import * as commonResponses from './commonResponses.mjs'

// eslint-disable-next-line import/prefer-default-export
export const components = {
  schemas: {
    ...commonSchemas,
    ...userSchema,
  },
  responses: {
    ...commonResponses,
  },
}
