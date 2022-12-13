import httpStatus from 'http-status'
import catchAsync from '../helpers/catchAsync.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import pick from '../helpers/pick.mjs'
import response from '../helpers/resolvedResponse.mjs'
import { catalogService } from '../services/index.mjs'

export const getCatalogues = catchAsync(async (req, res) => {
  try {
    const catalogues = await catalogService.getCatalogues()

    response(res, httpStatus.OK, httpStatus[200], catalogues)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})

export const getCatalog = catchAsync(async (req, res) => {
  const { id } = req.params

  try {
    const catalogues = await catalogService.getCatalogById(id)

    response(res, httpStatus.OK, httpStatus[200], catalogues)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})

export const createCatalog = catchAsync(async (req, res) => {
  const data = pick(req.body, ['name', 'parentId'])

  try {
    const catalog = await catalogService.createCatalog(data)

    if (!catalog) {
      return response(res, httpStatus.NO_CONTENT, httpStatus[204])
    }

    response(res, httpStatus.OK, httpStatus[200], catalog)
  } catch (err) {
    errorResponseSpecification(err, res, [httpStatus.BAD_REQUEST])
  }
})

export const updateCatalog = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = pick(req.body, ['name', 'parentId'])
  if (data.parentId === '') data.parentId = undefined

  try {
    const catalog = await catalogService.updateCatalogById(id, data)

    if (!catalog) {
      return response(res, httpStatus.NO_CONTENT, httpStatus[204])
    }

    response(res, httpStatus.OK, httpStatus[200], catalog)
  } catch (err) {
    errorResponseSpecification(err, res, [httpStatus.BAD_REQUEST])
  }
})

export const deleteCatalog = catchAsync(async (req, res) => {
  const { id } = req.params
  try {
    const catalog = await catalogService.deleteCatalogById(id)

    if (!catalog) {
      return response(res, httpStatus.NO_CONTENT, httpStatus[204])
    }

    response(res, httpStatus.OK, httpStatus[200], catalog)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})
