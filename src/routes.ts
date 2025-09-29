import { Router } from 'express'
import { requireAuth } from './middlewares/require-auth'
import { productsRouter } from './features/products/products.router'
import { categoriesRouter } from './features/categories/categories.router'
import { authRouter } from './features/auth/auth.router'
import { usersRouter } from './features/users/users.router'
import { categoriesAdminRouter } from './features/categories/admin/router'
import { productsAdminRouter } from './features/products/admin/router'

export const router = Router()

// Public/User Routes
router.use('/products', productsRouter)
router.use('/categories', categoriesRouter)
router.use('/auth', authRouter)
router.use('/users', requireAuth(), usersRouter)


// Admin Routes (Protected by Authorization)
const adminRouter = Router()
adminRouter.use(requireAuth('admin')) // Apply middleware to all admin routes

adminRouter.use('/products', productsAdminRouter)
adminRouter.use('/categories', categoriesAdminRouter)

router.use('/admin', adminRouter)
