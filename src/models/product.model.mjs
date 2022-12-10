import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
  // Name of product
  name: {
    type: String,
    required: true,
  },
  // Price of product
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  // Discount of product: Unit: percent %
  discount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 100,
  },
  // Primary link of product
  imageLink: {
    type: String,
  },
  // Extra links list of product
  imageList: {
    type: [String],
  },
  // Amount view of guest
  view: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Some description about product
  description: {
    type: String,
    maxLength: 5000,
  },
  // Quantity of product, which must not less than 0 and required
  quantity: {
    type: Number,
    min: 0,
    required: true,
  },
  // RAM of phone: unit: GB
  ram: {
    type: Number,
    min: 1,
  },
  // ROM of phone: unit: GB
  rom: {
    type: Number,
    min: 8,
  },
  // Battery of phone: unit: mAh
  battery: {
    type: Number,
    min: 1,
  },
  // Screensize of phone: unit: inch
  screensize: {
    type: Number,
    min: 4,
  },
  // Screen type of phone:
  screenType: {
    type: String,
  },
  // Color of phone: unit: inch
  color: {
    type: String,
  },
  // CPU of phone
  cpu: {
    type: String,
  },
  // GPU of phone
  gpu: {
    type: String,
  },
  // Release time of phone
  release: {
    type: Date,
  },
  // Warranty of phone: unit: month
  warranty: {
    type: Number,
    min: 1,
    required: true,
  },
  // bonus when buying phone
  bonus: {
    type: String,
    maxLength: 1000,
  },
  catalogId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Catalog',
    required: true,
  },
  brandId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Brand',
    required: true,
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Product = mongoose.model('Product', productSchema)
