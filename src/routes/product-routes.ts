import { Router } from 'express'
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
} from '../controllers/product-controllers'
import {
  validateBody,
  validateIdParam,
  validateQuery,
} from '../lib/validator-functions'
import { insertFullProductSchema } from '../db/zod-schemas'
import { upload } from '../lib/upload'
import { requireAuth } from '../middlewares/require-auth'
import { getProductsQuerySchema } from '../validation/get-products-query-schema'

const router: Router = Router()

// public
router.get('/', validateQuery(getProductsQuerySchema), getProducts)
router.get('/:id', validateIdParam(), getProductById)

// protected
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
