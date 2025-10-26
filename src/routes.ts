import { Router } from 'express'
import { requireAuth } from '@mw/require-auth'
import { productsRouter } from '@products/products.router'
import { categoriesRouter } from './features/categories/categories.router'
import { categoriesAdminRouter } from './features/categories/admin/router'
import { productsAdminRouter } from './features/products/admin/router'
import { authRouter } from '@auth/auth.router'
import { profileRouter } from 'src/features/profile/profile.router'
import { PublicOrdersRouter } from '@orders/orders.router'
import { optionalAuth } from '@mw/optional-auth'
import { ordersAdminRouter } from '@orders/admin/router'

export const router = Router()

// Public/User Routes
router.use('/products', productsRouter)
router.use('/categories', categoriesRouter)
router.use('/auth', authRouter)
router.use('/me', requireAuth(), profileRouter)
router.use('/orders', optionalAuth(), PublicOrdersRouter)

// Admin Routes (Protected by Authorization)
const adminRouter = Router()
adminRouter.use(requireAuth('admin')) // Apply middleware to all admin routes

adminRouter.use('/products', productsAdminRouter)
adminRouter.use('/categories', categoriesAdminRouter)
adminRouter.use('/orders',ordersAdminRouter)

router.use('/admin', adminRouter)
