# Auth

## POST /api/auth/register

### Body

```ts
type Data = {
  email: string // valid email
  password: string // length >= 8
}
```

### Response

```ts
type Data = {
  id: string // uuid
  email: string
  isEmailVerified: boolean
  role: 'customer' | 'admin'
}
```

## POST /api/auth/login

### Body

```ts
type Data = {
  email: string // valid email
  password: string // length >= 8
}
```

### Response

```ts
type Data = {
  id: string // uuid
  email: string
  isEmailVerified: boolean
  role: 'customer' | 'admin'
}
```

## POST /api/auth/refresh

### Response

```ts
type Data = {
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
type Data = {
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
type Data = {
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
type Data = {
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

# Products

## GET /api/products

### Query Params

```ts
type Query = {
  page?: number // default 1
  perPage?: number // default 20
  sort?: string
  search?: string | undefined
  categoryId?: string | undefined
}
```

### Response

```ts
type Data = {
  data: {
    isNew: boolean
    inventoryStatus: 'Out of Stock' | 'Low Stock' | 'In Stock'
    id: string
    slug: string
    name: string
    price: string
    categoryId: string | null
    reviewCount: number
    averageRating: number
    thumbnailUrl: string | null
  }[]
  page: number
  perPage: number
  total: number
  totalPages: number
  prevPage: number | null
  nextPage: number | null
}
```

## GET /api/products/:slug

### Response

```ts
type Data = {
  inventoryStatus: 'Out of Stock' | 'Low Stock' | 'In Stock'
  isNew: boolean
  averageRating: number | null
  reviewCount: number
  categoryName: string
  images: {
    url: string
    alt: string
    width: number | null
    height: number | null
    isPrimary: boolean
    size: number | null
  }[]
  reviews: {
    id: string
    rating: number
    comment: string | null
    date: Date
    edited: boolean
  }[]
  name: string
  id: string
  slug: string
  description: string
  price: string
  categoryId: string | null
  isDeleted: boolean
}
```

## POST /api/products/bulk

### Body

```ts
type Data = string[] // Ids
```

### Response

```ts
type Data = {
  isNew: boolean
  inventoryStatus: 'Out of Stock' | 'Low Stock' | 'In Stock'
  id: string
  slug: string
  name: string
  price: string
  categoryId: string | null
  reviewCount: number
  averageRating: number
  thumbnailUrl: string | null
}[]
```

# Profile (auth is required)

## GET /api/me

### Response

```ts
type Data = {
  id: string
  createdAt: Date
  email: string
  fullName: string | null
  role: string
  phone: string | null
  isEmailVerified: boolean
}
```

## PATCH /api/me

### Body

```ts
type Data = {
  fullName?: string
  phone?: string
}
```

## PATCH /api/me/password

### Body

```ts
type Data = {
  oldPassword: string
  newPassword: string
}
```

# Profile/Cart

## GET /api/me/cart

### Response

```ts
type Data = {
  thumbnailUrl: string
  reviewCount: number
  isNew: boolean
  inventoryStatus: 'Out of Stock' | 'Low Stock' | 'In Stock'
  averageRating: number | null
  name: string
  id: string
  slug: string
  price: string
  categoryId: string | null
  quantity: number
}[]
```

## POST /api/me/cart

### Body

```ts
type Data = {
  productId: string // uuid
  quantity: number //  int and >= 1
}
```

### Response

```ts
type Data = {
  id: string
  productId: string
  userId: string
  quantity: number
  addedAt: Date
}
```

## PATCH /api/me/cart/:id

### Body

```ts
type Data = {
  quantity: number //  int and >= 1
}
```

## DELETE /api/me/cart/:id

## DELETE /api/me/cart

## POST /api/me/cart/merge

### Body

```ts
type Data = {
  productId: string // uuid
  quantity: number // int and >= 1
}[]
```

# Profile/Addresses

## POST /api/me/addresses

### Body

```ts
type Data = {
  city: string
  postalCode: string
  addressLine1: string
  label: string
  addressLine2?: string | null | undefined
  isDefault?: boolean | undefined
}
```

### Response

```ts
type Data = {
  id: string
  createdAt: Date
  updatedAt: Date
  customerId: string
  city: string
  postalCode: string
  addressLine1: string
  addressLine2: string | null
  label: string
  isDefault: boolean
}
```

## GET /api/me/addresses

### Response

```ts
type Data = {
  id: string
  createdAt: Date
  updatedAt: Date
  customerId: string
  city: string
  postalCode: string
  addressLine1: string
  addressLine2: string | null
  label: string
  isDefault: boolean
}[]
```

## PATCH /api/me/addresses/:id

### Body

```ts
type Data = {
  city?: string | undefined
  postalCode?: string | undefined
  addressLine1?: string | undefined
  addressLine2?: string | null | undefined
  label?: string | undefined
  isDefault?: boolean | undefined
}
```

## DELETE /api/me/addresses/:id

# Profile/Orders

## GET /api/me/orders

### Response

```ts
type Data = {
  items: {
    productName: string
    productId: string
    quantity: number
    priceAtPurchase: string
  }[]
  id: number
  createdAt: Date
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'canceled'
  total: string
}[]
```

# Orders

## POST /api/orders

### Body

```ts
type Data = {
  name: string
  email: string
  phone: string
  city: string
  postalCode: string
  addressLine1: string
  items: {
    productId: string
    quantity?: number | undefined
  }[]
  addressLine2?: string | null | undefined
}
```

### Response

```ts
type Data = {
  id: number
  name: string
  orderToken: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
  customerId: string | null
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'canceled'
  total: string
  city: string
  postalCode: string
  addressLine1: string
  addressLine2: string | null
}
```

## GET /api/orders/:orderToken

### Response

```ts
type Data = {
  total: string
  id: number
}
```

# Admin/Categories

## POST /api/admin/categories

### Body

```ts
type Data = {
  name: string
  slug: string
  description: string
  status: 'active' | 'inactive'
}
```

### Response

```ts
type Data = {
  name: string
  id: string
  slug: string
  description: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}
```

## GET /api/admin/categories

### Query Params

```ts
type Query = {
  sort?: `${Field}:${Order}` // default createdAt:desc
  status?: 'active' | 'inactive'
  search?: string
}

type Field = 'name' | 'status' | 'createdAt' | 'updatedAt'
type Order = 'asc' | 'desc'
```

### Response

```ts
type Data = {
  productsCount: number
  name: string
  id: string
  slug: string
  description: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}[]
```

## GET /api/admin/categories/:id

### Response

```ts
type Data = {
  name: string
  id: string
  slug: string
  description: string
  status: 'active' | 'inactive'
  productsCount: number
  createdAt: Date
  updatedAt: Date
}
```

## GET /api/admin/categories/:id/products

### Response

```ts
type Data = {
  name: string
  id: string
  slug: string
  description: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
  price: string
  stock: number
  categoryId: string | null
  isDeleted: boolean
  images: {
    id: string
    createdAt: Date
    updatedAt: Date
    format: string | null
    url: string
    productId: string
    publicId: string
    alt: string
    isPrimary: boolean
    width: number | null
    height: number | null
    size: number | null
  }[]
}[]
```

## PATCH /api/admin/categories/:id

### Body

```ts
type Data = {
  name?: string
  slug?: string
  description?: string
  status?: 'active' | 'inactive'
}
```

### Response

```ts
type Data = {
  id: string
  name: string
  slug: string
  description: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}[]
```

## DELETE /api/admin/categories/:id

# Admin/Products

## POST /api/admin/products

### FormData (multipart-formdata)

- Image count must be between 1 and 5

```ts
type FormData = {
  name: string
  slug : string
  price : string // stringified number
  stock : string  // stringified number
  categoryId : string
  status : 'active' | 'inactive'
  `images[${i}].file` : File
  `images[${i}].alt` : string
  `images[${i}].isPrimary` : 'true' | 'false'

}
```

### Response

```ts
type Data = {
  status: 'active' | 'inactive'
  name: string
  createdAt: Date
  id: string
  description: string
  updatedAt: Date
  slug: string
  price: string
  stock: number
  categoryId: string | null
  isDeleted: boolean
  images: {
    url: string
    format: string | null
    createdAt: Date
    id: string
    updatedAt: Date
    productId: string
    publicId: string
    alt: string
    isPrimary: boolean
    width: number | null
    height: number | null
    size: number | null
  }[]
}
```

## PATCH /api/admin/products/:id

### FormData (multipart-formdata)

- Image count must be between 1 and 5

```ts
type FormData = {
  name: string
  slug : string
  price : string // stringified number
  stock : string  // stringified number
  categoryId : string
  status : 'active' | 'inactive'
  `images[${i}].file` : File // or .id if it already exists
  `images[${i}].alt` : string
  `images[${i}].isPrimary` : 'true' | 'false'

}
```

### Response

```ts
type Data = {
  images: {
    id: string
    url: string
    isPrimary: boolean
    alt: string
  }[]
  id: string
  name: string
  slug: string
  description: string
  price: string
  stock: number
  categoryId: string | null
  status: 'active' | 'inactive'
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
```

## GET /api/admin/products

### Query Params

```ts
type Query = {
  page?: number // default 1
  perPage?: number // default 10
  sort?: `${Field}:${SortOrder}` // default createdAt:desc
  search?: string
  categoryId?: string // uuid or __NULL__
  status?: 'active' | 'inactive'
}

type Field = 'name' | 'price' | 'stock' | 'status' | 'createdAt' | 'updatedAt'
type SortOrder = 'asc' | 'desc'
```

### Response

```ts
type Data = {
  data: {
    inventoryStatus: 'Out of Stock' | 'Low Stock' | 'In Stock'
    categoryName: string | null
    slug: string
    status: 'active' | 'inactive'
    name: string
    description: string
    price: string
    stock: number
    categoryId: string | null
    id: string
    createdAt: Date
    updatedAt: Date
    isDeleted: boolean
    images: {
      format: string | null
      id: string
      alt: string
      isPrimary: boolean
      url: string
      createdAt: Date
      updatedAt: Date
      productId: string
      publicId: string
      width: number | null
      height: number | null
      size: number | null
    }[]
  }[]
  page: number
  perPage: number
  total: number
  totalPages: number
  prevPage: number | null
  nextPage: number | null
}
```

## GET /api/admin/products/:id

### Response

```ts
type Data = {
  slug: string
  status: 'active' | 'inactive'
  name: string
  description: string
  price: string
  stock: number
  categoryId: string | null
  id: string
  inventoryStatus: 'Out of Stock' | 'Low Stock' | 'In Stock'
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean
  images: {
    format: string | null
    id: string
    alt: string
    isPrimary: boolean
    url: string
    createdAt: Date
    updatedAt: Date
    productId: string
    publicId: string
    width: number | null
    height: number | null
    size: number | null
  }[]
}
```

## DELETE /api/admin/products/:id

### Response

```ts
type Data = {
  productId: string
}
```

# Admin/Orders

## GET /api/admin/orders

### Query Params

```ts
type Query = {
  page?: number // default 1
  perPage?: number // default 10
  sort?: `${Field}:${SortOrder}` // default createdAt:desc
  search?: string
  status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'canceled'
}

type Field = 'name' | 'status' | 'createdAt' | 'total'
type SortOrder = 'asc' | 'desc'
```

### Resposne

```ts
type Data = {
  data: {
    itemCount: number
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'canceled'
    name: string
    createdAt: Date
    total: string
    id: number
    orderToken: string
    email: string
    phone: string
    updatedAt: Date
    customerId: string | null
    city: string
    postalCode: string
    addressLine1: string
    addressLine2: string | null
  }[]
  page: number
  perPage: number
  total: number
  totalPages: number
  prevPage: number | null
  nextPage: number | null
}
```

## GET /api/admin/orders/:id

### Response

```ts
type Data = {
  items: {
    id: string
    productId: string
    priceAtPurchase: string
    quantity: number
    name: string
    thumbnailUrl: string
  }[]
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'canceled'
  name: string
  createdAt: Date
  total: string
  id: number
  orderToken: string
  email: string
  phone: string
  updatedAt: Date
  customerId: string | null
  city: string
  postalCode: string
  addressLine1: string
  addressLine2: string | null
}
```

## PATCH /api/admin/orders/:id

### Body

```ts
type Body = {
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'canceled'
}
```

# Admin/Customers

## GET /api/admin/customers

### Query Params

```ts
type Query = {
  page?: number // default 1
  perPage?: number // default 10
  sort?: `${Field}:${SortOrder}` // default createdAt:desc
  search?: string
}

type Field = 'orders' | 'total' | 'createdAt'
type SortOrder = 'asc' | 'desc'
```

### Response

```ts
type Data = {
  data: {
    id: string
    name: string | null
    email: string
    phone: string | null
    joinedAt: Date
    totalSpent: number
    orderCount: number
  }[]
  page: number
  perPage: number
  total: number
  totalPages: number
  prevPage: number | null
  nextPage: number | null
}
```
