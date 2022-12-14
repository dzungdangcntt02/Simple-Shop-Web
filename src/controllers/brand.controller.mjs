import httpStatus from 'http-status'
import catchAsync from '../helpers/catchAsync.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import pick from '../helpers/pick.mjs'
import response from '../helpers/resolvedResponse.mjs'
import { brandService } from '../services/index.mjs'

export const getBrands = catchAsync(async (req, res) => {
  try {
    const brands = await brandService.getBrands()

    response(res, httpStatus.OK, httpStatus[200], brands)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})

export const getBrand = catchAsync(async (req, res) => {
  const { id } = req.params
  try {
    const brand = await brandService.getBrandById(id)

    if (!brand) {
      return response(res, httpStatus.NO_CONTENT, httpStatus[204])
    }

    response(res, httpStatus.OK, httpStatus[200], brand)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})

export const createBrand = catchAsync(async (req, res) => {
  const data = pick(req.body, ['name', 'link'])

  try {
    const brand = await brandService.createBrand(data)

    if (!brand) {
      return response(res, httpStatus.NO_CONTENT, httpStatus[204])
    }

    response(res, httpStatus.OK, httpStatus[200], brand)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})

export const updateBrand = catchAsync(async (req, res) => {
  const { id } = req.params
  const data = pick(req.body, ['name', 'link'])

  try {
    const brand = await brandService.updateBrandById(id, data)

    if (!brand) {
      return response(res, httpStatus.NO_CONTENT, httpStatus[204])
    }

    response(res, httpStatus.OK, httpStatus[200], brand)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})

export const deleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params
  try {
    const brand = await brandService.deleteBrandById(id)

    if (!brand) {
      return response(res, httpStatus.NO_CONTENT, httpStatus[204])
    }

    response(res, httpStatus.OK, httpStatus[200], brand)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})
