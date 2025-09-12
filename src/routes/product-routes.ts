import { Router } from 'express'
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
} from '../controllers/product-controller'

const router: Router = Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', addProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
