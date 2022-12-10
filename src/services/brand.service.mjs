import { Brand } from '../models/index.mjs'

export const getBrandById = async id => Brand.findById(id)

export const getBrands = async () => Brand.find({})
