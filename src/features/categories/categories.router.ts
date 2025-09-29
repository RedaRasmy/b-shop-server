import { Router } from 'express'
import {
  addCategorie,
  deleteCategorie,
  updateCategorie,
  getCategories,
  getCategorieById,
  getCategorieProducts,
} from './categories.controller'
import { validateBody, validateIdParam } from '@/middlewares/validators'
import { insertCategorieSchema } from './categories.validation'
import { requireAuth } from '@/middlewares/require-auth'

const router: Router = Router()

// public
router.get('/', getCategories)
router.get('/:id', validateIdParam(), getCategorieById)
router.get('/:id/products', validateIdParam(), getCategorieProducts)

// protected
router.post(
  '/',
  requireAuth('admin'),
  validateBody(insertCategorieSchema),
  addCategorie,
)
router.put(
  '/:id',
  requireAuth('admin'),
  validateIdParam(),
  validateBody(insertCategorieSchema),
  updateCategorie,
)
router.delete('/:id', requireAuth('admin'), validateIdParam(), deleteCategorie)

export default router
