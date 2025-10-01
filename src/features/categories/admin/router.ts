import { Router } from 'express'
import * as adminController from './controller'
import { validateBody, validateIdParam, validateQuery } from '@mw/validators'
import { InsertCategorySchema } from '../categories.validation'
import { CategoriesQuerySchema } from '@categories/admin/validation'

const router: Router = Router()

router.get('/', validateQuery(CategoriesQuerySchema) , adminController.getCategories)
router.get('/:id', validateIdParam, adminController.getCategoryById)
router.get(
  '/:id/products',
  validateIdParam,
  adminController.getCategoryProducts,
)

router.post(
  '/',
  validateBody(InsertCategorySchema),
  adminController.addCategory,
)
router.put(
  '/:id',
  validateIdParam,
  validateBody(InsertCategorySchema),
  adminController.updateCategory,
)
router.delete('/:id', validateIdParam, adminController.deleteCategory)

export const categoriesAdminRouter = router
