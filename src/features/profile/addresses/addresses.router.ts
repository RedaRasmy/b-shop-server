import {
  addAddress,
  getAddresses,
} from '@profile/addresses/addresses.controllers'
import { Router } from 'express'

const router = Router()

router.post('/', addAddress)
router.get('/', getAddresses)

export const addressesRouter = router
