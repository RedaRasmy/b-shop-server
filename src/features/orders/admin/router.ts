import { getOrders, updateOrder } from '@orders/admin/controller'
import { Router } from 'express'

const router = Router()

router.get('/', getOrders)
router.patch('/:id',updateOrder)

export const ordersAdminRouter = router
