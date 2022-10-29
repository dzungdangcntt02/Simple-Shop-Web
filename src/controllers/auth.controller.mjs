/* eslint-disable max-len */
import httpStatus from 'http-status'
import sse from './ssEvents.mjs'

import { getRandomArbitrary } from '../common/generateOTP.mjs'
import response from '../helpers/resolvedResponse.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import pick from '../helpers/pick.mjs'
import {
  authService,
  emailService,
  tokenService,
  userService,
} from '../services/index.mjs'
import sanitize from '../helpers/sanitizeDocument.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import {
  verifyAccount,
  status,
  resetPw,
  expireOTP,
  LIMIT_RP_REQUEST,
} from '../constants/index.mjs'
import ApiError from '../helpers/ApiError.mjs'
import { config } from '../validations/index.mjs'
import { stringToDate } from '../common/toDate.mjs'

export const register = catchAsync(async (req, res) => {
  const doc = pick(req.body, ['username', 'email', 'password'])
  try {
    const user = await userService.createUser(doc)
    const { resetPwRate, ...sanitizedUser } = sanitize(user, 0)

    const tokens = tokenService.generateAuthTokens(sanitizedUser)

    response(res, httpStatus.CREATED, httpStatus[201], {
      tokens,
      user: sanitizedUser,
    })
  } catch (e) {
    errorResponseSpecification(e, res, [httpStatus.BAD_REQUEST])
  }
})

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  try {
    const { resetPwRate, ...user } = await authService.loginWithEmailAndPassword(email, password)
    const tokens = tokenService.generateAuthTokens(user)

    response(res, httpStatus.OK, httpStatus[200], {
      user,
      tokens,
    })
  } catch (e) {
    errorResponseSpecification(e, res, [httpStatus.UNAUTHORIZED])
  }
})

export const sendValidationEmail = catchAsync(async (req, res) => {
  const { email } = req.body
  // TODO user already logged in so create new route user with correct API authorization
  // const legitUser = req.user
  // console.log(legitUser);

  try {
    const user = await userService.getUserByEmail(email)
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email not exists')
    }

    const validateAccountToken = user?.activateToken
    // If user is already activated or banned => Forbidden
    if (user.status === status.BANNED || user.status === status.ACTIVE) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    }
    // If this is the first time user send request to activate account => Send email
    if (!validateAccountToken) {
      const token = tokenService.generateValAccToken(user._id)
      user.activateToken = token
      await user.save()
      await emailService.sendEmail(email, verifyAccount(token))

      return response(res, httpStatus.OK, 'Email sent')
    }

    // If user send request to activate account the second time => Verify if token is expired or not
    try {
      // If token is still valid => User must open recent mail to activate
      tokenService.verifyToken(validateAccountToken, 'validateAccount')

      response(res, httpStatus.OK, 'Email already exist. Check mailbox')
    } catch (e) {
      // If token is expired => remove the old and create new one and send another mail to user
      if (e.message === httpStatus[401]) {
        const token = tokenService.generateValAccToken(user._id)
        user.activateToken = token
        await user.save()
        await emailService.sendEmail(email, verifyAccount(token))

        return response(res, httpStatus.CREATED, 'New email sent')
      }
    }
  } catch (err) {
    return errorResponseSpecification(err, res, [
      httpStatus.FORBIDDEN,
      httpStatus.BAD_REQUEST,
    ])
  }
})

export const confirmAccount = catchAsync(async (req, res) => {
  const { token } = req.params
  try {
    const { id } = tokenService.verifyToken(token, 'validateAccount', 'Invalid Token')

    const user = await userService.getUserById(id)

    // Prevent user from attemping to activate an verified / banned account
    // Or using a fake token to hack the verification system
    if (user?.activateToken === token && user.status === status.INACTIVE) {
      user.activateToken = undefined
      user.status = status.ACTIVE
      await user.save()
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    }

    response(res, httpStatus.OK, httpStatus[200])
  } catch (err) {
    errorResponseSpecification(err, res, [httpStatus.UNAUTHORIZED, httpStatus.FORBIDDEN])
  }
})

export const findAccount = catchAsync(async (req, res) => {
  const { email } = req.body
  const user = await userService.getUserByEmail(email)
  if (!user || user.status === status.INACTIVE) {
    throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
  }

  // Reset rate limit when user reach rate limit
  if (user.resetPwRate === 5) {
    user.resetPwRate = 0
  }

  const token = tokenService.generateToken({ sub: user._id }, config.defaultTokenKey, { expiresIn: 5 * 60 }) // Expires in 5 mins
  user.findAccountToken = token

  await user.save()

  response(res, httpStatus.OK, httpStatus[200], { token })
})

export const sendResetPwMail = catchAsync(async (req, res) => {
  const { token } = req.body
  // Temporary not using sending code OTP by phone number
  try {
    const { sub } = tokenService.verifyToken(token, 'default')
    const user = await userService.getUserById(sub)
    if (!user || !user?.findAccountToken || user.findAccountToken !== token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    const otp = getRandomArbitrary()
    user.resetPwCode = otp
    user.resetPwIssued = Date.now()

    await user.save()
    await emailService.sendEmail(user.email, resetPw(otp))

    // Token expires in 30 mins
    const clientToken = tokenService.generateToken({ sub: user._id }, config.clientRPTokenKey, { expiresIn: 30 * 60 })

    response(res, httpStatus.OK, httpStatus[200], {
      token: clientToken,
    })
  } catch (err) {
    errorResponseSpecification(err, res, [httpStatus.UNAUTHORIZED, httpStatus.FORBIDDEN])
  }
})

export const checkResetPwCode = catchAsync(async (req, res) => {
  const { token, secureCode } = req.body

  try {
    const { sub } = tokenService.verifyToken(token, 'client')

    const user = await userService.getUserById(sub)
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    if (user.resetPwRate >= LIMIT_RP_REQUEST) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    } else {
      user.resetPwRate += 1
    }

    if (!user?.resetPwCode && !user?.resetPwIssued && !user?.findAccountToken) {
      throw new ApiError(httpStatus.FORBIDDEN, httpStatus[403])
    }

    const isExpired = Date.now() - stringToDate(user.resetPwIssued) > expireOTP
    if (isExpired) {
      await user.save()

      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    if (user?.resetPwCode !== secureCode) {
      await user.save()

      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    user.resetPwCode = undefined
    user.resetPwRate = 0
    user.resetPwIssued = undefined
    user.findAccountToken = undefined
    // Expires in 30 mins
    user.resetPwToken = tokenService.generateToken({ sub: user._id }, config.secureTokenKey, { expiresIn: 30 * 60 })
    await user.save()

    response(res, httpStatus.OK, httpStatus[200], {
      token: user.resetPwToken,
    })
  } catch (err) {
    return errorResponseSpecification(err, res, [
      httpStatus.UNAUTHORIZED,
      httpStatus.FORBIDDEN,
    ])
  }
})

export const resetPassword = catchAsync(async (req, res) => {
  const { token, resetPassword: upcomingPw } = req.body

  try {
    const { sub } = tokenService.verifyToken(token, 'secure')
    const user = await userService.getUserById(sub)
    if (!user || !user?.resetPwToken || user?.resetPwToken !== token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, httpStatus[401])
    }

    user.password = userService.hashPassword(upcomingPw)
    user.resetPwToken = undefined
    await user.save()

    response(res, httpStatus.OK, httpStatus[200])
  } catch (err) {
    return errorResponseSpecification(err, res, [httpStatus.UNAUTHORIZED])
  }
})

export const ssActivateEmail = catchAsync(async (req, res) => {
  sse.send({ unRead: true }, 'post')
  return res.status(200).json({ unRead: true })
})

export const test = catchAsync(async (req, res) => {
  response(res, httpStatus.OK, httpStatus[200], {
    user: req.user,
  })
})
