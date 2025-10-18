import { Router } from 'express'
import { me, updatePassword, updateProfile } from './profile.controller'
import { cartRouter } from '@profile/cart/cart.router'

const router: Router = Router()

router.get('/', me)
router.patch('/', updateProfile)
router.patch('/password', updatePassword)
// Sub Routes
router.use('/cart', cartRouter)

export const profileRouter = router
