import mongoose from 'mongoose'

import { orderStatus } from '../constants/index.mjs'

const orderSchema = mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.NOT_DELIVERED,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  note: {
    type: String,
    maxLength: 255,
  },
  transactionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Transaction',
    required: true,
  },
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product',
    required: true,
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Order = mongoose.model('Order', orderSchema)
