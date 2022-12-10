import { cloudinary } from '../config/cloudinary.mjs'

// eslint-disable-next-line import/prefer-default-export
export const uploadFile = async (image) => cloudinary.uploader.upload(image, {
  upload_preset: 'xpxrhmr4',
})
