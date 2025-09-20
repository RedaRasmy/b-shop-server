import { Router } from "express";


const router:Router = Router()

router.get("/users")
router.get('/users/:id')
router.put('/users/:id/role')
router.delete('/users/:id')


export default router