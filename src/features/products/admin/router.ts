import { Router } from 'express'
import * as adminController from './controller'
import { uploadProductImages } from '@lib/upload'
import { handleNestedFiles } from '@mw/handle-nested-files'

const router = Router()

// ADD
router.post(
  '/',
  uploadProductImages(), // this put files in req.files (multer)
  handleNestedFiles, // this unflat body and put req.files in req.body.images
  adminController.addProduct,
)

// GET
router.get('/', adminController.getProducts)

router.get('/:id', adminController.getProductById)

// UPDATE

router.put(
  '/:id',
  uploadProductImages(), // this put files in req.files (multer)
  handleNestedFiles, // this put req.files in req.body.images
  adminController.updateProduct,
)

// DELETE

router.delete('/:id', adminController.deleteProduct)

export const productsAdminRouter = router
