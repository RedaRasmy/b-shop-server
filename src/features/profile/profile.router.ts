import { Router } from 'express'
import { me } from './profile.controller'

const router: Router = Router()

router.get('/', me)

export const profileRouter = router
