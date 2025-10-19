import { addOrder, getOrders } from '@profile/orders/orders.controller'
import { Router } from 'express'

const router = Router()

router.get('/', getOrders)
router.post('/', addOrder)

export const ordersRouter = router
