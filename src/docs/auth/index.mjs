import register from './register.mjs'
import signIn from './signIn.mjs'
import confirmEmail from './confirmEmail.mjs'
import confirmAccount from './confirmAccount.mjs'

export default {
  '/api/v1/register': {
    ...register,
  },
  '/api/v1/sign-in': {
    ...signIn,
  },
  '/api/v1/confirm-email': {
    ...confirmEmail,
  },
  '/api/v1/confirm-email/t={token}': {
    ...confirmAccount,
  },
}
