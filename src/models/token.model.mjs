import mongoose from 'mongoose'

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  isCurrentlyValid: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  isBlacklisted: {
    type: Boolean,
    default: false,
  },
  previousToken: {
    type: String,
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Token = mongoose.model('Token', tokenSchema)
