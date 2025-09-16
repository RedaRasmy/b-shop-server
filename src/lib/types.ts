import type { SImage} from '../db/schemas/product-images-schema'
import type { IProduct, SProduct } from '../db/schemas/product-schema'

export type UnusedAttributes = 'id' | 'createdAt' | 'updatedAt'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Image = {
    id?:string
    alt : string
    position: number
}

export type IFullProduct = Prettify<IProduct & {
    images : Image[]
}>

export type SFullProduct = Prettify<SProduct & {
    images : SImage[]
}>
