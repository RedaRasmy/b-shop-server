import { Router } from 'express'
import { login, logout, me, refresh, register } from './auth.controller'
import { requireAuth } from '@mw/require-auth'

const router: Router = Router()

router.post('/register',  register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.get('/me', requireAuth(), me)
// router.post("/forgot-password")
// router.post('/reset-password')

export const authRouter = router
