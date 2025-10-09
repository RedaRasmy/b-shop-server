import { Router } from 'express'
import * as controller from './products.controller'

const router: Router = Router()

router.get('/' , controller.getProducts)
router.get('/:id', controller.getProductById)

export const productsRouter = router
