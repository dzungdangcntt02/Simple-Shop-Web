/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
import { cloudinary } from '../config/cloudinary.mjs'

import catchAsync from '../helpers/catchAsync.mjs';
import { errorResponseSpecification } from '../helpers/errorResponse.mjs';
import response from '../helpers/resolvedResponse.mjs'

export const uploadFile = catchAsync(async (req, res) => {
  const { image } = req.body
  try {
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      upload_preset: 'xpxrhmr4',
    })
    return res.send({ code: 200 })
  } catch (err) {
    errorResponseSpecification(err, res)
  }
})
