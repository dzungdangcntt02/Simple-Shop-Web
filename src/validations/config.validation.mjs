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
    HOST: Joi.string().default('localhost'),
    DB_NAME: Joi.string().required().description('name of database').default('default'),
    JWT_ACCESS_TOKEN_LIFE: Joi.number().default(30).description('minutes life for expired access token'),
    JWT_REFRESH_TOKEN_LIFE: Joi.number().default(30).description('days life for expired refresh token'),
    JWT_ACCESS_TOKEN_KEY: Joi.string().required().description('JWT access token key'),
    JWT_REFRESH_TOKEN_KEY: Joi.string().required().description('JWT refresh token key'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}
export const accessTokenLife = envVars.JWT_ACCESS_TOKEN_LIFE
export const refreshTokenLife = envVars.JWT_REFRESH_TOKEN_LIFE
export const accessTokenKey = envVars.JWT_ACCESS_TOKEN_KEY
export const refreshTokenKey = envVars.JWT_REFRESH_TOKEN_KEY
export const dbName = envVars.DB_NAME
export const nodeEnv = envVars.NODE_ENV
export const port = envVars.PORT
export const host = envVars.HOST
