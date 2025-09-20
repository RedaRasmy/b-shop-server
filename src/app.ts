import express, { type Express } from 'express'
import { errorHandler } from './middlewares/error-handler'
import { notFound } from './middlewares/not-found'
import productsRoutes from './routes/product-routes'
import categoriesRoutes from './routes/categorie-routes'
import authRoutes from './routes/auth-routes'
import usersRoutes from './routes/user-routes'
import adminRoutes from './routes/admin-routes'

const app: Express = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/api/products', productsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/auth', authRoutes)
app.use("/api/users",usersRoutes)
app.use("/api/admin",adminRoutes)

app.use(notFound)
// Global error handler (should be after routes)
app.use(errorHandler)

export default app
