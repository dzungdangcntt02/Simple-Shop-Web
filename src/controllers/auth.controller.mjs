import httpStatus from 'http-status'

import response from '../helpers/resolvedResponse.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import pick from '../helpers/pick.mjs'
import { authService, tokenService, userService } from '../services/index.mjs'
import { default as sanitize } from '../helpers/sanitizeDocument.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'

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

export const test = catchAsync(async (req, res) => {
  response(res, httpStatus.OK, httpStatus[200], {
    user: req.user,
  })
})
