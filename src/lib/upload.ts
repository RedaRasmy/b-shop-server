import multer from 'multer'

export const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5,
  },
  storage: multer.memoryStorage(),
})

export function uploadProductImages() {
  return upload.fields([
    { name: 'images[0].file', maxCount: 1 },
    { name: 'images[1].file', maxCount: 1 },
    { name: 'images[2].file', maxCount: 1 },
    { name: 'images[3].file', maxCount: 1 },
    { name: 'images[4].file', maxCount: 1 },
  ])
}
