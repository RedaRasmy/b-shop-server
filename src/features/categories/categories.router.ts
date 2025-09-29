import { Router } from 'express'
import * as controller from './categories.controller'
import { validateIdParam } from '@mw/validators'

const router: Router = Router()

router.get('/', controller.getCategories)
router.get('/:id', validateIdParam, controller.getCategoryById)
router.get('/:id/products', validateIdParam , controller.getCategoryProducts)



export const categoriesRouter = router
