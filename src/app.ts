import express from 'express'
import { errorHandler } from './middlewares/error-handler'
import { notFound } from './middlewares/not-found'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { router } from './routes'
import helmet from 'helmet'
import { limiter } from './lib/limiter'
import config from './config/config'

const app = express()

app.use(limiter)

app.use(helmet())
app.use(cookieParser())

const allowedOrigins = config.FRONTEND_URL.split(',')
console.log(allowedOrigins)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/api', router)

app.use(notFound)
// Global error handler (should be after routes)
app.use(errorHandler)

export default app
