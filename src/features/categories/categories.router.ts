import { Router } from 'express'
import * as controller from './categories.controller'

const router: Router = Router()

router.get('/', controller.getCategories)
router.get('/:id', controller.getCategoryById)
router.get('/:id/products', controller.getCategoryProducts)



export const categoriesRouter = router
