import { getOrders } from '@orders/admin/controller'
import { Router } from 'express'

const router = Router()

router.get('/', getOrders)

export const ordersAdminRouter = router
