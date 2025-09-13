import { Router } from 'express'
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
} from '../controllers/product-controller'
import { validateBody, validateIdParam } from '../lib/validator-functions'
import { insertProductSchema } from '../db/zod-schemas'

const router: Router = Router()

router.get('/', getProducts)
router.get('/:id', validateIdParam(), getProductById)
router.post('/', validateBody(insertProductSchema), addProduct)
router.put(
  '/:id',
  validateIdParam(),
  validateBody(insertProductSchema),
  updateProduct,
)
router.delete('/:id', validateIdParam(), deleteProduct)

export default router
