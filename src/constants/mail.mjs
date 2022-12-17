import { V1, ENDPOINTS } from './api.mjs'
import { config } from '../validations/index.mjs'
import { Order } from '../models/order.model.mjs'
import formatCurrencyVND from '../common/formatCurrencyVND.mjs'

const validateURL = token => ((config.nodeEnv === 'production')
  ? `${config.host}${V1}/${ENDPOINTS.USER.BASE}/${ENDPOINTS.USER.VALIDATE_EMAIL}/t=${token}`
  : `http://${config.host}:${config.port}${V1}/${ENDPOINTS.USER.BASE}/${ENDPOINTS.USER.VALIDATE_EMAIL}/t=${token}`)

const generateTableData = async data => {
  const orderList = await Promise.all(data.map(async order => Order.findById(order.id).populate('productId')))
  const tableData = orderList.map((item, idx) => {
    const x = `<tr style="height: 50px;">
      <td style="padding: 0 4px; text-align: center;">${idx}<td>
      <td style="padding: 0 4px; text-align: center;">${item.productId.name}<td>
      <td style="padding: 0 4px; text-align: right;">${formatCurrencyVND(item.price)}<td>
      <td style="padding: 0 4px; text-align: right;">${item.amount}<td>
      <td style="padding: 0 4px; text-align: right;">${item.discount} %<td>
      <td style="padding: 0 4px; text-align: right;">${formatCurrencyVND(item.getTotalPrice())}<td>
    </tr>`

    return x
  })
  // eslint-disable-next-line max-len
  const totalAmount = orderList.reduce((prev, curr) => prev + (curr.price * curr.amount * (100 - curr.discount)) / 100, 0)
  return { tableData, totalAmount }
}

export const orderConfirmation = async (userInfo, data) => {
  const orders = await generateTableData(data)
  return {
    subject: 'Bạn có đơn hàng sẽ được gửi từ SimpleShop',
    text: `Chào ${userInfo.username}, đây là thông tin chi tiết đơn hàng của bạn!`,
    html: `
    <h1 style="color: red; text-align: center;">Chào ${userInfo.username}, đây là thông tin chi tiết đơn hàng của bạn!</h1>
    <center>
      <table style="auto" width="100%" border="1" cellspacing="0" cellpadding="0">
        <tr style="height: 70px;">
          <th>STT</th>
          <th></th>
          <th>Sản phẩm</th>
          <th></th>
          <th>Đơn giá</th>
          <th></th>
          <th>Số lượng</th>
          <th></th>
          <th>Giảm giá</th>
          <th></th>
          <th>Tổng tiền</th>
        </tr>
        ${orders.tableData}
        <tr style="height: 70px;">
          <td colspan="10" style="font-weight: bold; text-align: center;">
            Tổng tiền
          </td>
          <td style="font-weight: bold; text-align: center;">
            ${formatCurrencyVND(orders.totalAmount)}
          </td>
        </tr>
        <tr style="height: 120px; border: 0px;">
          <td style="border: 0px; padding-left: 8px;" colspan="3">Số điện thoại: ${userInfo.userPhone}</td>
          <td style="border: 0px;" colspan="8">Địa chỉ: ${userInfo.userAddress}</td>
        </tr>
        <tr style="height: 120px; border: 0px;">
          <td style="border: 0px; padding-left: 8px;" colspan="3">Ghi chú:</td>
          <td style="border: 0px;" colspan="8">${userInfo.note}</td>
        </tr>
      </table>
    </center>
  `,
  }
}
export const verifyAccount = token => ({
  subject: 'Verify your Simple Web\'s account',
  text: `Click to this link ${validateURL(token)} to verify your account`,
  html: `
  <div style="display: flex; justify-content: center;">
  <a href="${validateURL(token)}"
  style="display: inline-block; 
  background-color: #04AA6D;
  text-decoration: none;
  color: #fff;
  padding: 16px 12px;
  border-radius: 12px;
  font-size: 20px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
    Verify your account
  </a>
</div>
  `,
})

export const resetPw = code => ({
  subject: 'Reset your Simple Web\'s password',
  text: `Copy this OTP code ${code} to reset your password. If there are some mistake, ignore this email.`,
  html: `
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
  <div style="margin: 8px 8px; font-size: 16px;">
    Use OTP code below to reset your password.
  </div>
  <div style="margin: 8px 8px; font-size: 12px;">
    If there are some mistake, ignore this email.
  </div>
  <div
  style="
  background-color: #04AA6D;
  width: 200px;
  text-align: center;
  color: #fff;
  padding: 16px 12px;
  border-radius: 12px;
  font-size: 20px;
  "
  >
    <strong>${code}</strong>
  </div>
</div>
  `,
})
