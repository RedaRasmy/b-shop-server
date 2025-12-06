import { Router } from 'express'
import {
  login,
  logout,
  refresh,
  register,
  resetPassword,
  forgotPassword,
  sendVerifyEmail,
  verifyEmail
} from './auth.controller'
import { getLimiter } from '../../lib/limiter'

const strictLimiter = getLimiter(15, 50)

const router: Router = Router()

router.use(strictLimiter)

router.post('/register', register)
router.post('/login', getLimiter(15, 10), login)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.post('/forgot-password', getLimiter(60, 5), forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/verify-email',sendVerifyEmail)
router.post('/verify-email/verify',verifyEmail)

export const authRouter = router
