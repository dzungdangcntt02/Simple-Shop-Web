import httpStatus from 'http-status'
import ApiError from '../helpers/ApiError.mjs'
import { Product } from '../models/index.mjs'
import { getBrandById } from './brand.service.mjs'
import { getCatalogById } from './catalog.service.mjs'
import { uploadFile } from './image.service.mjs'

export const getAllProduct = async () => Product.find({}).populate(['brandId', 'catalogId'])

export const getProductById = async id => Product.findById(id).populate(['brandId', 'catalogId'])

export const createProduct = async data => {
  if (!(await getBrandById(data.brandId))
    || !(await getCatalogById(data.catalogId))) {
    throw new ApiError(httpStatus[400], httpStatus.BAD_REQUEST)
  }

  const { image, listSubImage, ...cleanData } = data
  try {
    const primaryImage = await uploadFile(image)
    cleanData.imageLink = primaryImage.public_id

    let subImage = null
    let listSubImagePromises = null
    if (data?.listSubImage.length === 1) {
      subImage = await uploadFile(listSubImage[0])
      cleanData.imageList = [subImage.public_id]
    } else if (data?.listSubImage.length >= 2) {
      listSubImagePromises = listSubImage.map(async sub => uploadFile(sub))
    }

    if (!listSubImagePromises) {
      return Product.create(cleanData)
    }

    Promise.all(listSubImagePromises)
      .then(async images => {
        const imageListProp = images.map(img => img.public_id)
        cleanData.imageList = imageListProp
        return Product.create(cleanData)
      })
      .catch(error => {
        throw new Error(error)
      })
  } catch (err) {
    throw new Error(err)
  }
}

// eslint-disable-next-line max-len
export const updateProductById = async (id, data) => {
  if (!(await getBrandById(data.brandId))
    || !(await getCatalogById(data.catalogId))) {
    throw new ApiError(httpStatus[400], httpStatus.BAD_REQUEST)
  }

  const { image, listSubImage, ...cleanData } = data

  try {
    const primaryImage = await uploadFile(image)
    cleanData.imageLink = primaryImage.public_id

    let subImage = null
    let listSubImagePromises = null
    if (data?.listSubImage.length === 1) {
      subImage = await uploadFile(listSubImage[0])
      cleanData.imageList = [subImage.public_id]
    } else if (data?.listSubImage.length >= 2) {
      listSubImagePromises = listSubImage.map(async sub => uploadFile(sub))
    }

    if (!listSubImagePromises) {
      return Product.findByIdAndUpdate(id, cleanData, { new: true })
    }

    Promise.all(listSubImagePromises)
      .then(async images => {
        const imageListProp = images.map(img => img.public_id)
        cleanData.imageList = imageListProp
        return Product.findByIdAndUpdate(id, cleanData, { new: true })
      })
      .catch(error => {
        throw new Error(error)
      })
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteProductById = async id => Product.findByIdAndDelete(id)
