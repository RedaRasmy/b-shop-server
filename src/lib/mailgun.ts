import Mailgun from 'mailgun.js'
import config from '../config/config'
import FormData from 'form-data'

export const mailgun = new Mailgun(FormData).client({
  username: 'api',
  key: config.MAILGUN_API_KEY,
})
