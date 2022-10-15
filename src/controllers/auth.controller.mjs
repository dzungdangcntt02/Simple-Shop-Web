import httpStatus from 'http-status'

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
import { verifyAccount, status } from '../constants/index.mjs'
import ApiError from '../helpers/ApiError.mjs'

export const register = catchAsync(async (req, res) => {
  const doc = pick(req.body, ['username', 'email', 'password'])
  try {
    const user = await userService.createUser(doc)
    const sanitizedUser = sanitize(user, 0)

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
    const user = await authService.loginWithEmailAndPassword(email, password)
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

      return response(res, httpStatus.NO_CONTENT, 'Email already exist. Check mailbox')
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

export const test = catchAsync(async (req, res) => {
  response(res, httpStatus.OK, httpStatus[200], {
    user: req.user,
  })
})
