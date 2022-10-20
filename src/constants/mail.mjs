import { V1, ENDPOINTS } from './api.mjs'
import { config } from '../validations/index.mjs'

const validateURL = token => `http://${config.host}:${config.port}${V1}${ENDPOINTS.AUTH.BASE}/${ENDPOINTS.AUTH.VALIDATE_EMAIL}/t=${token}`

// eslint-disable-next-line import/prefer-default-export
export const verifyAccount = url => ({
  subject: 'Verify your Simple Web\'s account',
  text: `Click to this link ${validateURL(url)} to verify your account`,
  html: `
  <div style="display: flex; justify-content: center;">
  <a href="${validateURL(url)}"
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
