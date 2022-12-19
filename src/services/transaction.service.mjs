import httpStatus from 'http-status'
import ApiError from '../helpers/ApiError.mjs'
import { Transaction } from '../models/index.mjs'
import { createOrders, generateOrder } from './order.service.mjs'

export const checkoutGuestUser = async (data) => {
  const { cart, userId, ...info } = data

  try {
    const orderList = await Promise.all(cart.map(async item => generateOrder(item)))
    const transaction = await Transaction.create(info)

    const orderPopulateTransaction = orderList.map(order => {
      const x = { ...order }
      x.transactionId = transaction._id
      return x
    })

    return await createOrders(orderPopulateTransaction)
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err?.message)
  }
}

// eslint-disable-next-line max-len
export const getAllTransaction = async (projection, filter = {}) => Transaction.find(filter, projection)

export const getTransactionById = async id => Transaction.findById(id).populate('userId')

export const updateTransactionById = async (id, status) => Transaction.findByIdAndUpdate(id, { status: status.toString() }, { returnDocument: 'after', lean: true })
