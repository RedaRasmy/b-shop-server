import { getOrders, updateOrder , getOrder } from '@orders/admin/controller'
import { Router } from 'express'

const router = Router()

router.get('/', getOrders)
router.get('/:id',getOrder)
router.patch('/:id',updateOrder)

export const ordersAdminRouter = router
