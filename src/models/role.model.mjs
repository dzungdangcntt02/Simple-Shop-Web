import mongoose from 'mongoose'
import { permissionArray } from '../config/permissions.mjs'

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: {
      unique: true,
    },
  },
  permission: {
    type: [String],
    enum: permissionArray,
    default: [],
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Role = mongoose.model('Role', roleSchema)
