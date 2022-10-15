import { loadJSON } from '../common/loadJSON.mjs'
import { config } from '../validations/index.mjs'
import { api } from '../constants/index.mjs'

const { version } = loadJSON('../../package.json')

// eslint-disable-next-line import/prefer-default-export
export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    version,
    title: 'Express API for Simple Shop',
    description:
      'This is a REST API application made with Express.',
  },
  servers: [
    {
      url: `http://${config.host}:${config.port}${api.API_V1}`,
      description: 'Development server',
    },
  ],
}
