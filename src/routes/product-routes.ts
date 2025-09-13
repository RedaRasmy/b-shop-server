import { Router } from 'express'
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
} from '../controllers/product-controllers'
import { validateBody, validateIdParam } from '../lib/validator-functions'
import { insertFullProductSchema } from '../db/zod-schemas'

const router: Router = Router()

router.get('/', getProducts)
router.get('/:id', validateIdParam(), getProductById)
router.post('/', validateBody(insertFullProductSchema), addProduct)
router.put(
  '/:id',
  validateIdParam(),
  validateBody(insertFullProductSchema),
  updateProduct,
)
router.delete('/:id', validateIdParam(), deleteProduct)

export default router
