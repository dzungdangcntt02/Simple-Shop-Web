import httpStatus from 'http-status'

import response from '../helpers/response.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import { userService } from '../services/index.mjs'

const register = catchAsync(async (req, res) => {
  const { email, password, username } = req.body
  if (!username || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST)
      .send(response(httpStatus.BAD_REQUEST, httpStatus[400]))
  }

  try {
    // Promise.resolve() to disable ts(80007) false positive
    const isEmailExisted = await Promise.resolve(userService.isEmailTaken(email))
    if (isEmailExisted) {
      return res.status(httpStatus.BAD_REQUEST)
        .send(response(httpStatus.BAD_REQUEST, 'Email already taken'))
    }

    const user = await userService.createUser({
      username,
      email,
      password,
    })
    if (!user) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR, httpStatus[500])
    }

    const token = 'token_kjw3lnawekj'
    return res.status(httpStatus.CREATED)
      .send(response(httpStatus.CREATED, httpStatus[201], {
        user,
        token,
      }))
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR, httpStatus[500])
  }
})

export {
  // eslint-disable-next-line import/prefer-default-export
  register,
}
