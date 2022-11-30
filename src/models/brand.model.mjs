import mongoose from 'mongoose'

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Logo of brand
  imageLogo: {
    type: String,
    required: true,
  },
  // URL to original website of brand
  link: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Brand = mongoose.model('Brand', brandSchema)
