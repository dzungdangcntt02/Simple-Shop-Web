/* eslint-disable max-len */
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'

import { config } from '../validations/index.mjs'
import ApiError from '../helpers/ApiError.mjs'

const {
  accessTokenLife,
  accessTokenKey,
  refreshTokenLife,
  refreshTokenKey,
} = config

export const generateToken = (payload, key, options) => jwt.sign(payload, key, options)

export const generateAuthTokens = user => {
  const now = DateTime.now().toUnixInteger()
  const accessTokenExpires = accessTokenLife * 60 // Minutes
  const refreshTokenExpires = refreshTokenLife * 60 * 60 * 24 // Days
  const id = user?._id || user?.id
  const { role, status } = user
  const payload = {
    role,
    status,
    sub: id,
    iat: now,
  }
  const accessToken = generateToken(payload, accessTokenKey, { expiresIn: accessTokenExpires })
  const refreshToken = generateToken(payload, refreshTokenKey, { expiresIn: refreshTokenExpires })
  return {
    access: {
      token: accessToken,
      expiresIn: accessTokenExpires, // Duration expires
    },
    refresh: {
      token: refreshToken,
      expiresIn: refreshTokenExpires, // Duration expires
    },
  }
}
/**
 * @Returns {string} a validate account token
 */
export const generateValAccToken = userId => generateToken({ id: userId }, config.validateAccountTokenKey, {
  expiresIn: config.validateAccountTokenLife * 60,
})

/**
 * Return decoded payload or throw API error when token is invalid
 * @param {string} token
 * @param {string} keyType 'access' | 'refresh' | 'validateAccount'
 * @param {string} msg custom message throw when token is invalid
 * @returns {object|error}
 */
export const verifyToken = (token, keyType = 'access', msg = undefined) => {
  let key
  if (keyType === 'access') {
    key = config.accessTokenKey
  } else if (keyType === 'refresh') {
    key = config.refreshTokenKey
  } else if (keyType === 'validateAccount') {
    key = config.validateAccountTokenKey
  } else if (keyType === 'default') {
    key = config.defaultTokenKey
  } else {
    throw new Error('Type error! Key must be one of \'access\' or \'refresh\'')
  }

  try {
    const decodedPayload = jwt.verify(token, key)
    return decodedPayload
  } catch (e) {
    // Invalid token: malformed token
    throw new ApiError(httpStatus.UNAUTHORIZED, msg || httpStatus[401])
  }
}
