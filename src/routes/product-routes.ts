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
import { upload } from '../lib/upload'

const router: Router = Router()

router.get('/', getProducts)
router.get('/:id', validateIdParam(), getProductById)
router.post('/', upload.array('images',5) ,validateBody(insertFullProductSchema), addProduct)
router.put(
  '/:id',
  upload.array('images',5),
  validateIdParam(),
  validateBody(insertFullProductSchema),
  updateProduct,
)
router.delete('/:id', validateIdParam(), deleteProduct)

export default router
