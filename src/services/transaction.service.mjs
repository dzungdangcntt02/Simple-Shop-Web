import httpStatus from 'http-status'
import ApiError from '../helpers/ApiError.mjs'
import { Transaction } from '../models/index.mjs'
import { createOrders, generateOrder } from './order.service.mjs'

// eslint-disable-next-line import/prefer-default-export
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
