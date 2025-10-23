import { addOrder } from '@orders/orders.controller'
import { Router } from 'express'

const router = Router()

router.post('/', addOrder)

export const PublicOrdersRouter = router
