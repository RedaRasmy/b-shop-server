import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from '../addresses/addresses.controllers'
import { Router } from 'express'

const router = Router()

router.post('/', addAddress)
router.get('/', getAddresses)
router.patch('/:id', updateAddress)
router.delete('/:id', deleteAddress)

export const addressesRouter = router
