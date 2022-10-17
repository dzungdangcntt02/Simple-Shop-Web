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
    JWT_VALIDATE_ACCOUNT_TOKEN_LIFE: Joi.number().default(5).description('minutes life for expired validate account token'),
    JWT_ACCESS_TOKEN_KEY: Joi.string().required().description('JWT access token key'),
    JWT_REFRESH_TOKEN_KEY: Joi.string().required().description('JWT refresh token key'),
    JWT_VALIDATE_ACCOUNT_TOKEN_KEY: Joi.string().required().description('JWT validate account token key'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
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
export const validateAccountTokenKey = envVars.JWT_VALIDATE_ACCOUNT_TOKEN_KEY
export const validateAccountTokenLife = envVars.JWT_VALIDATE_ACCOUNT_TOKEN_LIFE
export const mailKeyAPI = envVars.SENDGRID_API_KEY
export const mailSender = envVars.SENDGRID_SENDER
export const dbName = envVars.DB_NAME
export const nodeEnv = envVars.NODE_ENV
export const port = envVars.PORT
export const host = envVars.HOST
export const email = {
  smtp: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    auth: {
      user: envVars.SMTP_USERNAME,
      pass: envVars.SMTP_PASSWORD,
    },
  },
  from: envVars.EMAIL_FROM,
}
