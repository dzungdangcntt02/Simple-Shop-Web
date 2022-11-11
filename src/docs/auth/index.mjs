import register from './register.mjs'
import signIn from './signIn.mjs'
import findAccount from './findAccount.mjs'
import resetpwEmail from './resetpwEmail.mjs'
import confirmPwCode from './confirmPwCode.mjs'
import resetPw from './resetPw.mjs'

export default {
  '/api/v1/auth/register': {
    ...register,
  },
  '/api/v1/auth/sign-in': {
    ...signIn,
  },
  '/api/v1/auth/find-account': {
    ...findAccount,
  },
  '/api/v1/auth/resetpw-email': {
    ...resetpwEmail,
  },
  '/api/v1/auth/confirm-pwcode': {
    ...confirmPwCode,
  },
  '/api/v1/auth/reset-pw': {
    ...resetPw,
  },
}
