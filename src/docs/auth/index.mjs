import register from './register.mjs'
import signIn from './signIn.mjs'
import confirmEmail from './confirmEmail.mjs'
import confirmAccount from './confirmAccount.mjs'
import findAccount from './findAccount.mjs'
import resetpwEmail from './resetpwEmail.mjs'
import confirmPwCode from './confirmPwCode.mjs'
import resetPw from './resetPw.mjs'

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
  '/api/v1/find-account': {
    ...findAccount,
  },
  '/api/v1/resetpw-email': {
    ...resetpwEmail,
  },
  '/api/v1/confirm-pwcode': {
    ...confirmPwCode,
  },
  '/api/v1/reset-pw': {
    ...resetPw,
  },
}
