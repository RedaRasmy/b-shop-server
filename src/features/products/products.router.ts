import { Router } from 'express'
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
} from './products.controller'
import {
  validateBody,
  validateIdParam,
  validateQuery,
} from '@/middlewares/validators'
import { insertFullProductSchema } from './products.validation'
import { upload } from '@/lib/upload'
import { requireAuth } from '@/middlewares/require-auth'
import { getProductsQuerySchema } from './products.validation'

const router: Router = Router()

// public
router.get('/', validateQuery(getProductsQuerySchema), getProducts)
router.get('/:id', validateIdParam(), getProductById)

// protected (admin)
router.post(
  '/',
  requireAuth('admin'),
  upload.array('images', 5),
  validateBody(insertFullProductSchema),
  addProduct,
)
router.put(
  '/:id',
  requireAuth('admin'),
  upload.array('images', 5),
  validateIdParam(),
  validateBody(insertFullProductSchema),
  updateProduct,
)
router.delete('/:id', requireAuth('admin'), validateIdParam(), deleteProduct)

export default router
