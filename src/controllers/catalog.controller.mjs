import httpStatus from 'http-status'
import ApiError from '../helpers/ApiError.mjs'
import catchAsync from '../helpers/catchAsync.mjs'
import { errorResponseSpecification } from '../helpers/errorResponse.mjs'
import response from '../helpers/resolvedResponse.mjs'
import { catalogService } from '../services/index.mjs'

// eslint-disable-next-line import/prefer-default-export
export const getCatalogues = catchAsync(async (req, res) => {
  try {
    const catalogues = await catalogService.getCatalogues()

    response(res, httpStatus.OK, httpStatus[200], catalogues)
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})
