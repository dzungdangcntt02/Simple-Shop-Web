import register from './register.mjs'
import signIn from './signIn.mjs'
import confirmEmail from './confirmEmail.mjs'
import confirmAccount from './confirmAccount.mjs'

export default {
  '/api/register': {
    ...register,
  },
  '/api/sign-in': {
    ...signIn,
  },
  '/api/confirm-email': {
    ...confirmEmail,
  },
  '/api/confirm-email/t={token}': {
    ...confirmAccount,
  },
}
