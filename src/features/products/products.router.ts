import { Router } from 'express'
import * as controller from './products.controller'
import { optionalAuth } from '@mw/optional-auth'

const router: Router = Router()

router.get('/', controller.getProducts)
router.get('/:slug', optionalAuth(), controller.getProductBySlug)
router.post('/bulk', controller.getProductsByIds)

export const productsRouter = router
