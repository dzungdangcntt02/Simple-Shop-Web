import Joi from 'joi'

import { password } from './custom.validation.mjs'

export const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
}

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}

export const confirmEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
}

export const confirmAccount = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
}

export const findAccount = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
}

export const sendResetPwMail = {
  // params: Joi.object().keys({
  //   secureToken: Joi.string().required(),
  // }),
  body: Joi.object().keys({
    token: Joi.string().required(),
    option: Joi.string().required().valid('byEmail', 'byPhoneNumber'),
  }),
}
