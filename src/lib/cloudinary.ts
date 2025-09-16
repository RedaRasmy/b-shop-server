import {v2 as cloudinary, type AdminAndResourceOptions} from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true
})


export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  secure_url: string;
  created_at: string;
  resource_type: string;
  type: string;
  version: number;
}

export interface ProcessedUploadResult {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const uploadImageBuffer = async (
  fileBuffer: Buffer, 
  originalName: string,
  folder: string = 'products-images'
):Promise<ProcessedUploadResult> => {
  const options = {
    folder: folder,
    public_id: `${Date.now()}-${originalName.split('.')[0]}`,
    resource_type: 'auto' as const,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes
            });
          } else {
            reject(new Error('Upload failed - no result'));
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Function to upload multiple images
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string = 'products'
) => {
  const uploadPromises = files.map(file => 
    uploadImageBuffer(file.buffer, file.originalname, folder)
  );
  
  return Promise.all(uploadPromises);
};

// Keep your existing functions
export const getAssetInfo = async (publicId: string) => {
  const options: AdminAndResourceOptions = {
    colors: true,
  };

  try {
    const result = await cloudinary.api.resource(publicId, options);
    console.log(result);
    return result.colors;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Function to delete images (useful for cleanup)
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};