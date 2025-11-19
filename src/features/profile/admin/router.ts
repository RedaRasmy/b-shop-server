import { getCustomers } from '../admin/controller'
import { Router } from 'express'

const router = Router()

router.get('/', getCustomers)

export const customersAdminRouter = router
