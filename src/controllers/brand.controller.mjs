import httpStatus from 'http-status'
import ApiError from '../helpers/ApiError.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import response from '../helpers/resolvedResponse.mjs'
import { brandService } from '../services/index.mjs'

// eslint-disable-next-line import/prefer-default-export
export const getBrands = catchAsync(async (req, res) => {
  try {
    const brands = await brandService.getBrands()

    response(res, httpStatus.OK, httpStatus[200], brands)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})
