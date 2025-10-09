import { Router } from 'express'
import * as adminController from './controller'

const router: Router = Router()

router.get('/', adminController.getCategories)
router.get('/:id', adminController.getCategoryById)
router.get('/:id/products', adminController.getCategoryProducts)

router.post('/', adminController.addCategory)
router.put('/:id', adminController.updateCategory)
router.delete('/:id', adminController.deleteCategory)

export const categoriesAdminRouter = router
