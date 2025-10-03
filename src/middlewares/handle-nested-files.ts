import { Request, Response, NextFunction } from 'express'
import { unflatten } from 'flat'

export function handleNestedFiles() {
  return function (req: Request, res: Response, next: NextFunction) {
    // Step 1: Unflatten body
    req.body = unflatten(req.body)

    // Step 2: Merge file(s) into req.body based on field names
    const images = req.body.images

    if (Array.isArray(images) && req.files && !Array.isArray(req.files)) {
      const files = req.files as Record<string, Express.Multer.File[]>

      for (let i = 0; i < images.length; i++) {
        const fileKey = `images[${i}].file`
        const fileArray = files[fileKey]
        if (fileArray && fileArray.length > 0) {
          images[i].file = fileArray[0] // attach file to matching image
        }
      }
    }

    next()
  }
}