import { Router } from 'express'
import { requireAuth } from './middlewares/require-auth'
import { productsRouter } from './features/products/products.router'
import { categoriesRouter } from './features/categories/categories.router'
import { categoriesAdminRouter } from './features/categories/admin/router'
import { productsAdminRouter } from './features/products/admin/router'
import { authRouter } from './features/auth/auth.router'
import { profileRouter } from './features/profile/profile.router'
import { PublicOrdersRouter } from './features/orders/orders.router'
import { optionalAuth } from './middlewares/optional-auth'
import { ordersAdminRouter } from './features/orders/admin/router'
import { customersAdminRouter } from './features/profile/admin/router'

export const router = Router()

// Public/User Routes
router.use('/products', productsRouter)
router.use('/categories', categoriesRouter)
router.use('/auth', authRouter)
router.use('/me', requireAuth(), profileRouter)
router.use('/orders', optionalAuth(), PublicOrdersRouter)

// Admin Routes (Protected)
const adminRouter = Router()
adminRouter.use(requireAuth('admin')) // Apply middleware to all admin routes

adminRouter.use('/products', productsAdminRouter)
adminRouter.use('/categories', categoriesAdminRouter)
adminRouter.use('/orders', ordersAdminRouter)
adminRouter.use('/customers', customersAdminRouter)

router.use('/admin', adminRouter)
