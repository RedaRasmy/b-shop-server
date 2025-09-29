export type UnusedAttributes = 'id' | 'createdAt' | 'updatedAt'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}



