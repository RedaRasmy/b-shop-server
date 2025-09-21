import { Router } from "express";
import { validateBody } from "../lib/validator-functions";
import { emailPasswordSchema } from "../db/zod-schemas";
import { login, logout, register } from "../controllers/auth-controllers";

const router:Router = Router()

router.post("/register",validateBody(emailPasswordSchema) , register )
router.post("/login", validateBody(emailPasswordSchema) , login )
router.post("/logout" , logout )
router.post('/refresh')
router.post("/forgot-password")
router.post('/reset-password')

export default router