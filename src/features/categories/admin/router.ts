import { Router } from 'express'
import * as adminController from './controller'
import { validateBody, validateIdParam } from '@mw/validators'
import { insertCategorieSchema } from '../categories.validation'

const router: Router = Router()

router.get('/', adminController.getCategories)
router.get('/:id', validateIdParam, adminController.getCategoryById)
router.get(
  '/:id/products',
  validateIdParam,
  adminController.getCategoryProducts,
)

router.post(
  '/',
  validateBody(insertCategorieSchema),
  adminController.addCategory,
)
router.put(
  '/:id',
  validateIdParam,
  validateBody(insertCategorieSchema),
  adminController.updateCategory,
)
router.delete('/:id', validateIdParam, adminController.deleteCategory)

export const categoriesAdminRouter = router
// export default router
