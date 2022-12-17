// import ApiError from '../helpers/ApiError.mjs'
import httpStatus from 'http-status'
import { orderConfirmation } from '../constants/mail.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import pick from '../helpers/pick.mjs'
import response from '../helpers/resolvedResponse.mjs'
import { emailService, transactionService } from '../services/index.mjs'

// eslint-disable-next-line import/prefer-default-export
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
