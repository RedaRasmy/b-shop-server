import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

// Updae here first !
const configSchema = z.object({
  port: z.coerce.number().positive().default(3000),
  nodeEnv: z.string().default('development'),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  FRONTEND_URL: z.url(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_URL: z.string().min(1),
  MAILGUN_API_KEY: z.string().min(1),
  MAILGUN_DOMAIN: z.string().min(1),
  MAILGUN_FROM: z.string().min(1)
})

type Config = Partial<z.input<typeof configSchema>>

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN : process.env.MAILGUN_DOMAIN,
  MAILGUN_FROM : process.env.MAILGUN_FROM 
}

export default configSchema.parse(config)
