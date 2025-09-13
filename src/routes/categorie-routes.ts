import { Router } from 'express'
import {
  addCategorie,
  deleteCategorie,
  updateCategorie,
  getCategories,
  getCategorieById
} from '../controllers/categorie-controllers'
import { validateBody, validateIdParam } from '../lib/validator-functions'
import { insertCategorieSchema } from '../db/zod-schemas'

const router: Router = Router()

router.get('/', getCategories)
router.get('/:id', validateIdParam(), getCategorieById)
router.post('/', validateBody(insertCategorieSchema), addCategorie)
router.put(
  '/:id',
  validateIdParam(),
  validateBody(insertCategorieSchema),
  updateCategorie,
)
router.delete('/:id', validateIdParam(), deleteCategorie)

export default router
