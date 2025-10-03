import { Router } from 'express'
import * as adminController from './controller'
import { uploadProductImages } from '@lib/upload'
import { validateBody, validateIdParam, validateQuery } from '@mw/validators'
import {
  AddProductSchema,
  AdminProductsQuerySchema,
} from '@products/admin/validation'
import { handleNestedFiles } from '@mw/handle-nested-files'

const router = Router()

// ADD
router.post(
  '/',
  uploadProductImages(), // this put files in req.files (multer)
  handleNestedFiles, // this unflat body and put req.files in req.body.images
  validateBody(AddProductSchema), // validate and transform values to the right types
  adminController.addProduct,
)

// GET

router.get(
  '/',
  validateQuery(AdminProductsQuerySchema),
  adminController.getProducts,
)

router.get('/:id', validateIdParam, adminController.getProductById)

// UPDATE

router.put(
  '/:id',
  validateIdParam,
  uploadProductImages(), // this put files in req.files (multer)
  handleNestedFiles, // this put req.files in req.body.images
  validateBody(AddProductSchema), // validate and transform values to the right types
  adminController.updateProduct,
)

// DELETE

router.delete('/:id', validateIdParam, adminController.deleteProduct)

export const productsAdminRouter = router
