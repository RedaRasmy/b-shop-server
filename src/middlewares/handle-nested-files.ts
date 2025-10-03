import { Request, Response, NextFunction } from 'express'

export function handleNestedFiles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const flatBody = req.body

  const images: any[] = []

  for (const key in flatBody) {
    const match = key.match(/^images\[(\d+)\]\.(.+)$/) // Match `images[0].alt`, etc.
    if (match) {
      const index = parseInt(match[1], 10)
      const prop = match[2]

      if (!images[index]) {
        images[index] = {}
      }

      images[index][prop] = flatBody[key]
      delete flatBody[key] // Clean up flattened key
    }
  }

  req.body.images = images
  req.body = {
    ...flatBody,
    images,
  }

  if (req.files && !Array.isArray(req.files)) {
    const files = req.files as Record<string, Express.Multer.File[]>

    images.forEach((img, i) => {
      const fileKey = `images[${i}].file`
      const file = files[fileKey]?.[0]
      if (file) {
        img.file = file
      }
    })
  }

  console.log('final req.body before validation : ', req.body)

  next()
}
