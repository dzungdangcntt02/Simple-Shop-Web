// eslint-disable-next-line import/no-extraneous-dependencies
import { config } from 'dotenv'
import Joi from 'joi'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

config({ path: join(__dirname, '..', '..', '.env') })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(2703),
    DB_NAME: Joi.string().required().description('name of database').default('default'),
    API_KEY: Joi.string().description('type string'),
    API_SECRET: Joi.string().description('type string'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}
export const dbName = envVars.DB_NAME
export const nodeEnv = envVars.NODE_ENV
export const port = envVars.PORT
export const mongoose = {
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
}
