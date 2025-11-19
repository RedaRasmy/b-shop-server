import { getOrders } from '../orders/orders.controller'
import { Router } from 'express'

const router = Router()

router.get('/', getOrders)

export const ordersRouter = router
