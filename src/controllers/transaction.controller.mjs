// import ApiError from '../helpers/ApiError.mjs'
import httpStatus from 'http-status'
import { orderConfirmation } from '../constants/mail.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import pick from '../helpers/pick.mjs'
import response from '../helpers/resolvedResponse.mjs'
import { emailService, orderService, transactionService } from '../services/index.mjs'

export const createTransaction = catchAsync(async (req, res) => {
  const data = pick(req.body, ['username', 'userEmail', 'userPhone', 'userAddress', 'totalAmount', 'userId', 'note', 'cart'])

  try {
    const orderList = await transactionService.checkoutGuestUser(data)
    await emailService.sendEmail(data.userEmail, await orderConfirmation(data, orderList))
    response(res, httpStatus.CREATED, 'Đã thanh toán thành công, vui lòng kiểm tra hòm thư email')
  } catch (err) {
    errorResponseSpecification(err, res, [httpStatus.BAD_REQUEST])
  }
})

export const getTransactions = catchAsync(async (req, res) => {
  try {
    const transactionList = await transactionService.getAllTransaction('username userEmail userPhone status totalAmount createdAt')

    response(res, httpStatus.OK, httpStatus[200], transactionList)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})

export const getTransaction = catchAsync(async (req, res) => {
  const { id } = req.params

  try {
    const transaction = await transactionService.getTransactionById(id)
    const orderList = await orderService.getOrderByTransactionId(id)

    response(res, httpStatus.OK, httpStatus[200], { transaction, orderList })
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})

export const updateTransaction = catchAsync(async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const transaction = await transactionService.updateTransactionById(id, status)

    response(res, httpStatus.OK, httpStatus[200], transaction)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})
