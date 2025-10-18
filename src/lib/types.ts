export type UnusedAttributes = 'id' | 'createdAt' | 'updatedAt'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Order = 'asc' | 'desc'

export type ToRecord<T extends readonly string[]> = Prettify<
  Record<T[number], string>
>
