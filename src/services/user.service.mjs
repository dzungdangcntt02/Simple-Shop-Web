import User from '../models/user.model.mjs'

/**
 * True when email has been already assigned
 * @param {String} email
 * @returns {Boolean}
 */
export const isEmailTaken = async email => {
  const user = await User.findOne({ email })
  return !!user
}

/**
 * @param {Object} username: String | emai: String | password: String
 * @returns {Object} user
 */
export const createUser = async doc => User.create(doc)
