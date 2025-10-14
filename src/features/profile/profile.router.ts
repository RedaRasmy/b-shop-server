import { Router } from 'express'
import { me } from './profile.controller'
import { cartRouter } from '@profile/cart/cart.router'

const router: Router = Router()

router.get('/', me)
// Sub Routes
router.use('/cart',cartRouter)

export const profileRouter = router
