import mongoose from 'mongoose'

import { transactionStatus } from '../constants/index.mjs'

const transactionSchema = mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: Object.values(transactionStatus),
  },
  username: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 1,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Transaction = mongoose.model('Transaction', transactionSchema)
