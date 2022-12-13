import mongoose from 'mongoose'

const catalogSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Catalog',
  },
}, {
  timestamps: true,
})

// eslint-disable-next-line import/prefer-default-export
export const Catalog = mongoose.model('Catalog', catalogSchema)
