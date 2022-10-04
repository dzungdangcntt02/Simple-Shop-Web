import Joi from 'joi'

import { password } from './custom.validation.mjs'

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
}

export {
  // eslint-disable-next-line import/prefer-default-export
  register,
}
