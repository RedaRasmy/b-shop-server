import { Router } from 'express'
import { me, updatePassword, updateProfile } from './profile.controller'
import { cartRouter } from '@profile/cart/cart.router'
import { addressesRouter } from '@profile/addresses/addresses.router'
import { ordersRouter } from '@profile/orders/orders.router'

const router: Router = Router()

router.get('/', me)
router.patch('/', updateProfile)
router.patch('/password', updatePassword)
// Sub Routes
router.use('/cart', cartRouter)
router.use('/addresses', addressesRouter)
router.use('/orders', ordersRouter)

export const profileRouter = router
