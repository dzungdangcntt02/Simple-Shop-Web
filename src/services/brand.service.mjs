import { Brand } from '../models/index.mjs'

export const getBrandById = async id => Brand.findById(id)

export const getBrands = async () => Brand.find({}).lean()

export const createBrand = async data => Brand.create(data)

export const updateBrandById = async (id, data) => Brand.findByIdAndUpdate(id, data, { lean: true, returnDocument: 'after' })

export const deleteBrandById = async id => Brand.findByIdAndDelete(id)
