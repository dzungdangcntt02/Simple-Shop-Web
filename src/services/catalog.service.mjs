import { Catalog } from '../models/index.mjs'

export const getCatalogById = async id => Catalog.findById(id)

export const getCatalogues = async () => Catalog.find({})
