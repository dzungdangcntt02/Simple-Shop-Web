import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
  // Giá tiền món hàng được mua chưa áp giảm giá khi đặt đơn khi đó
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
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  transactionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Transaction',
    required: true,
    default: null,
  },
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product',
    required: true,
  },
}, {
  timestamps: true,
})

orderSchema.methods.getTotalPrice = function () {
  return (1.0 * (this.price * this.amount * (100 - this.discount))) / 100;
}

// eslint-disable-next-line import/prefer-default-export
export const Order = mongoose.model('Order', orderSchema)
