import { Router } from 'express'
import * as controller from './products.controller'
import { validateIdParam, validateQuery } from '@mw/validators'
import { getProductsQuerySchema } from './products.validation'

const router: Router = Router()

router.get('/', validateQuery(getProductsQuerySchema), controller.getProducts)
router.get('/:id', validateIdParam , controller.getProductById)

export const productsRouter = router
