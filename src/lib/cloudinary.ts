import config from '@config/config'
import { slugify } from '@utils/slugify'
import { v2 as cloudinary, type AdminAndResourceOptions } from 'cloudinary'
import logger from 'src/logger'
import { v4 as uuid } from 'uuid'

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface CloudinaryUploadResult {
  url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
  secure_url: string
  created_at: string
  resource_type: string
  type: string
  version: number
}

export interface ProcessedUploadResult {
  url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

export const uploadImageBuffer = async ({
  fileBuffer,
  folder,
}: {
  fileBuffer: Buffer
  folder: string
}): Promise<ProcessedUploadResult> => {
  const options = {
    folder: folder,
    public_id: `${uuid()}`,
    resource_type: 'auto' as const,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Upload failed - no result'))
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        })
      })
      .end(fileBuffer)
  })
}

// Function to upload multiple images
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string,
) => {
  const uploadPromises = files.map((file) =>
    uploadImageBuffer({
      fileBuffer: file.buffer,
      folder,
    }),
  )
  return Promise.all(uploadPromises)
}

// Keep your existing functions
export const getAssetInfo = async (publicId: string) => {
  const options: AdminAndResourceOptions = {
    colors: true,
  }

  try {
    const result = await cloudinary.api.resource(publicId, options)
    return result.colors
  } catch (error) {
    throw error
  }
}

// Function to delete images
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    logger.error(error,"Failed to delete cloudinary image")
    throw error
  }
}

export const deleteMultipleImages = async (publicIds: string[]) => {
  const deletePromises = publicIds.map((publicId) => deleteImage(publicId))

  return Promise.all(deletePromises)
}
