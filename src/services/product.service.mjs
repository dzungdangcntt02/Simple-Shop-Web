import httpStatus from 'http-status'
import logger from '../config/logger.mjs'
import ApiError from '../helpers/ApiError.mjs'
import { Product } from '../models/index.mjs'
import { getBrandById } from './brand.service.mjs'
import { getCatalogById } from './catalog.service.mjs'
import { deleteFiles, uploadFile } from './image.service.mjs'

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

    const subImages = []
    // eslint-disable-next-line no-restricted-syntax
    for (const binImage of listSubImage) {
      // eslint-disable-next-line no-await-in-loop
      const returnedImage = await uploadFile(binImage)
      subImages.push(returnedImage.public_id)
    }
    cleanData.imageList = subImages
    return Product.create(cleanData)

    // TODO Tại sao promise all lại trả về response request
    // TODO mà không đợi thực hiện xong mới trả về như vòng lặp
    // Promise.all(listSubImagePromises)
    //   .then(async images => {
    //     const imageListProp = images.map(img => img.public_id)
    //     cleanData.imageList = imageListProp
    //     const prod = await Product.create(cleanData)
    //     return prod
    //   })
    //   .catch(error => {
    //     throw new Error(error)
    //   })
  } catch (err) {
    throw new Error(err)
  }
}

export const updateProductById = async (id, data) => {
  if (!(await getBrandById(data.brandId))
    || !(await getCatalogById(data.catalogId))) {
    throw new ApiError(httpStatus[400], httpStatus.BAD_REQUEST)
  }

  const { image, ...cleanData } = data

  try {
    if (image) {
      const primaryImage = await uploadFile(image)
      cleanData.imageLink = primaryImage.public_id
    }

    return Product.findByIdAndUpdate(id, cleanData, { new: true })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') logger.error(err)
    throw new Error(err)
  }
}

export const deleteProductById = async id => {
  const prod = await Product.findByIdAndDelete(id)
  if (!prod) {
    return null
  }

  let publicIds = [prod.imageLink]
  if (prod?.imageList?.length > 0) {
    // eslint-disable-next-line no-unsafe-optional-chaining
    publicIds = [...publicIds, ...prod?.imageList]
  }

  await deleteFiles(publicIds)

  return prod
}
