import { cloudinary } from '../config/cloudinary.mjs'

export const uploadFile = async (image) => cloudinary.uploader.upload(image, {
  upload_preset: 'xpxrhmr4',
})

export const deleteFiles = async (ids) => cloudinary.api.delete_resources(ids)
