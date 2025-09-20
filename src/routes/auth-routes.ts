import { Router } from "express";

const router:Router = Router()

router.post("/register")
router.post("/login")
router.post("/logout")
router.post('/refresh')
router.post("/forgot-password")
router.post('/reset-password')

export default router