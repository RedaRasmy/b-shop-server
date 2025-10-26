import { addOrder, getOrder } from '@orders/orders.controller'
import { Router } from 'express'

const router = Router()

router.post('/', addOrder)
router.get('/:orderToken', getOrder)

export const PublicOrdersRouter = router
