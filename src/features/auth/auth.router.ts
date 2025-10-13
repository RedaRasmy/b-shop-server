import { Router } from 'express'
import { login, logout,  refresh, register } from './auth.controller'

const router: Router = Router()

router.post('/register',  register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)
// router.post("/forgot-password")
// router.post('/reset-password')

export const authRouter = router
