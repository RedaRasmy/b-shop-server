import { Router } from 'express'
import * as adminController from './controller'
import { upload } from '@lib/upload'
import { validateBody, validateIdParam, validateQuery } from '@mw/validators'
import { AddProductSchema, AdminProductsQuerySchema } from '@products/admin/validation'

const router = Router()

router.get(
  '/',
  validateQuery(AdminProductsQuerySchema),
  adminController.getProducts,
)
router.get('/:id', validateIdParam, adminController.getProductById)
router.post(
  '/',
  upload.fields([
    { name: 'images[0].file', maxCount: 1 },
    { name: 'images[1].file', maxCount: 1 },
    { name: 'images[2].file', maxCount: 1 },
    { name: 'images[3].file', maxCount: 1 },
    { name: 'images[4].file', maxCount: 1 },
  ]),
  validateBody(AddProductSchema),
  adminController.addProduct,
)
router.put(
  '/:id',
  upload.array('images', 5),
  validateIdParam,
  validateBody(AddProductSchema),
  adminController.updateProduct,
)
router.delete('/:id', validateIdParam, adminController.deleteProduct)

export const productsAdminRouter = router
