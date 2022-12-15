import mongoose from 'mongoose'

import { orderStatus } from '../constants/index.mjs'

const orderSchema = mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.NOT_DELIVERED,
  },
  // Giá tiền món hàng được mua khi đặt đơn khi đó
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  // Số lượng món hàng khi đặt đơn khi đó
  amount: {
    type: Number,
    required: true,
    min: 1,
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
  note: {
    type: String,
    maxLength: 255,
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Order = mongoose.model('Order', orderSchema)
