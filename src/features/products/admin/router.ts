import { Router } from 'express'
import * as adminController from './controller'
import { upload } from '@lib/upload'
import {
  validateBody,
  validateIdParam,
  validateQuery,
} from '@mw/validators'
import {
  getProductsQuerySchema,
  insertFullProductSchema,
} from '../products.validation'

const router = Router()

router.get(
  '/',
  validateQuery(getProductsQuerySchema),
  adminController.getProducts,
)
router.get('/:id', validateIdParam, adminController.getProductById)
router.post(
  '/',
  upload.array('images', 5),
  validateBody(insertFullProductSchema),
  adminController.addProduct,
)
router.put(
  '/:id',
  upload.array('images', 5),
  validateIdParam,
  validateBody(insertFullProductSchema),
  adminController.updateProduct,
)
router.delete('/:id', validateIdParam, adminController.deleteProduct)

export const productsAdminRouter = router
