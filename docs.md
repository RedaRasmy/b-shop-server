# Auth

## POST /api/auth/register

### Body

```ts
type = {
  email: string // valid email
  password: string // length >= 8
}
```

### Response

```ts
type = {
  id: string // uuid
  email: string
  isEmailVerified: boolean
  role: 'customer' | 'admin'
}
```

## POST /api/auth/login

### Body

```ts
type = {
  email: string // valid email
  password: string // length >= 8
}
```

### Response

```ts
type = {
  id: string // uuid
  email: string
  isEmailVerified: boolean
  role: 'customer' | 'admin'
}
```

## POST /api/auth/refresh

### Response

```ts
type = {
  id: string // uuid
  email: string
  isEmailVerified: boolean
  role: 'customer' | 'admin'
}
```

## POST /api/auth/logout

### Response

```ts
{
  message: string
}
```

# Categories

## GET /api/categories

### Response

```ts
type = {
    id: string
    name: string
    slug: string
    description: string
    createdAt: Date
    updatedAt: Date
  }[]

```

## GET /api/categories/:id

### Response

```ts
type = {
    id: string
    name: string
    slug: string
    description: string
    createdAt: Date
    updatedAt: Date
  }
```

## GET /api/categories/:id/products

### Response

```ts
type = {
  inventoryStatus: 'Out of Stock' | 'Low Stock' | 'In Stock'
  name: string
  id: string
  description: string
  slug: string
  price: string
  categoryId: string | null
  isDeleted: boolean
  images: {
    format: string | null
    createdAt: Date
    id: string
    updatedAt: Date
    url: string
    productId: string
    publicId: string
    alt: string
    isPrimary: boolean
    width: number | null
    height: number | null
    size: number | null
  }[]
  reviews: {
    createdAt: Date
    id: string
    updatedAt: Date
    productId: string
    userId: string
    rating: number
    comment: string | null
  }[]
}[]
```
