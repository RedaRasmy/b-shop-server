import { Router } from 'express'
import { me, updateProfile } from './profile.controller'
import { cartRouter } from '@profile/cart/cart.router'

const router: Router = Router()

router.get('/', me)
router.patch('/',updateProfile)
// Sub Routes
router.use('/cart',cartRouter)

export const profileRouter = router
