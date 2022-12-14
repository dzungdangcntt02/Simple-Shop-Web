import httpStatus from 'http-status'
import ApiError from '../helpers/ApiError.mjs'
import { Catalog } from '../models/index.mjs'

export const getCatalogById = async id => Catalog.findById(id).populate('parentId')

export const getCatalogues = async () => Catalog.find({}).populate('parentId').lean()

export const createCatalog = async data => {
  if (!data?.parentId) return Catalog.create(data)

  const parentCatalog = await getCatalogById(data?.parentId)
  if (!parentCatalog) throw new ApiError(httpStatus.BAD_REQUEST, 'parent id of catalog must be existing')

  return Catalog.create(data)
}

export const updateCatalogById = async (id, data) => {
  if (!data?.parentId) {
    const catalog = await Catalog.findByIdAndUpdate(id, data, { lean: false, returnDocument: 'after' })
    catalog.parentId = undefined
    await catalog.save()

    return catalog
  }

  const parentCatalog = await getCatalogById(data?.parentId)
  if (!parentCatalog) throw new ApiError(httpStatus.BAD_REQUEST, 'parent id of catalog must be existing')

  return Catalog.findByIdAndUpdate(id, data, { lean: true, returnDocument: 'after' })
}

export const deleteCatalogById = async id => Catalog.findByIdAndDelete(id)
