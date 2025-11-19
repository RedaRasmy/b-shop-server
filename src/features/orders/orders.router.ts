import { addOrder, getOrder } from './orders.controller'
import { Router } from 'express'

const router = Router()

router.post('/', addOrder)
router.get('/:orderToken', getOrder)

export const PublicOrdersRouter = router
