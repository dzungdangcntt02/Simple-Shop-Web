import mongoose from 'mongoose'

import { CANCELED, NOT_PAID, PAID } from '../constants/transaction.mjs'

const transactionSchema = mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: [NOT_PAID, PAID, CANCELED],
    default: NOT_PAID,
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
  userAddress: {
    type: String,
    required: true,
    maxLength: 512,
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
  note: {
    type: String,
    maxLength: 512,
  },
  // Automatically add to transaction totalAmount
  shipCost: {
    type: Number,
    min: 0,
    default: 30000,
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Transaction = mongoose.model('Transaction', transactionSchema)
