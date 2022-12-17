import httpStatus from 'http-status'
import ApiError from '../helpers/ApiError.mjs'
import { Order, Product } from '../models/index.mjs'

export const generateOrder = async (data) => {
  const {
    id, amount, price, discount,
  } = data
  try {
    const product = await Product.findById(id)
    if (!product) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Không tìm thấy sản phẩm!')
    }

    if (product.quantity - amount < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Không đủ số lượng để bán')
    }

    product.quantity -= amount
    const order = {
      price,
      amount,
      discount,
      productId: id,
    }
    await product.save()
    return order
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err?.message)
  }
}

export const createOrders = async (orderList) => Order.create(orderList)

// export const getOrderById = async (id) => 
