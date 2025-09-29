import express from 'express'
import { errorHandler } from './middlewares/error-handler'
import { notFound } from './middlewares/not-found'
import productsRouter from './features/products/products.router'
import categoriesRouter from './features/categories/categories.router'
import authRouter from './features/auth/auth.router'
import usersRouter from './features/users/users.router'
// import adminRouter from './routes/admin-routes'
import { requireAuth } from './middlewares/require-auth'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', requireAuth(), usersRouter)
// app.use('/api/admin', requireAuth('admin'), adminRoutes)

app.use(notFound)
// Global error handler (should be after routes)
app.use(errorHandler)

export default app
