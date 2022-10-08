import mongoose from 'mongoose'
import slugify from 'slugify'

import { role, gender, status } from '../constants/index.mjs'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [8, 'Password must be at least 8 characters'],
    private: true,
  },
  // username: Dang Duc Bao Dzung => slug: Dang-Duc-Bao-Dung
  slug: {
    type: String,
  },
  status: {
    type: String,
    default: 'inactive',
    enum: Object.values(status),
  },
  address: {
    type: String,
    minLength: [30, 'Address must be longer than 30 characters'],
  },
  phoneNumber: {
    type: String,
    maxLength: [11, 'Phone number must be shorter than 12 characters'],
  },
  gender: {
    type: String,
    enum: Object.values(gender),
  },
  // Populate to role model by role name
  role: {
    type: String,
    enum: role.roleArr,
    default: role.USER,
  },
}, {
  timestamps: true,
  // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toJSON: { virtuals: true },
  // So `console.log()` and other functions that use `toObject()` include virtuals
  toObject: { virtuals: true },
})

/**
 * * Js code
 * `
 *  const x = await User.findById({ _id: '63472aaabb3e2e6764f03f4c' })
      .populate({
        path: 'rolePermissions',
        select: 'permission',
      })
    console.log(x.rolePermissions[0].permission)
  `
 * * Sample of virtual populate one-to-many
 */
userSchema.virtual('rolePermissions', {
  localField: 'role', // userSchema field which is foregin key
  ref: 'Role', // The model to use
  foreignField: 'name', // roleSchema field which is temporary primary key
})

userSchema.methods.rolePopulating = async function (projection) {
  const userPopulate = this.populate({
    path: 'rolePermissions',
    select: projection,
  })
  return userPopulate;
};

userSchema.pre('save', async function (next) {
  this.slug = slugify(this.username, { lower: true })
  next()
})

// eslint-disable-next-line import/prefer-default-export
export const User = mongoose.model('User', userSchema)
