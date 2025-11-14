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

# Products

## GET /api/products

### Query Params

```ts
type = {
    page?: number ; // default 1
    perPage?: number ; // default 20
    sort?: string;
    search?: string | undefined;
    categoryId?: string | undefined;
}
```

### Response

```ts
type = {
  data :  {
    isNew: boolean;
    inventoryStatus: "Out of Stock" | "Low Stock" | "In Stock";
    id: string;
    slug: string;
    name: string;
    price: string;
    categoryId: string | null;
    reviewCount: number;
    averageRating: number;
    thumbnailUrl: string | null;
  }[]
  page : number
  perPage : number
  total : number
  totalPages : number
  prevPage : number | null
  nextPage : number | null
}
```

## GET /api/products/:slug

### Response

```ts
type = {
    inventoryStatus: "Out of Stock" | "Low Stock" | "In Stock";
    isNew: boolean;
    averageRating: number | null;
    reviewCount: number;
    categoryName: string;
    images: {
        url: string;
        alt: string;
        width: number | null;
        height: number | null;
        isPrimary: boolean;
        size: number | null;
    }[];
    reviews: {
        id: string;
        rating: number;
        comment: string | null;
        date: Date;
        edited: boolean;
    }[];
    name: string;
    id: string;
    slug: string;
    description: string;
    price: string;
    categoryId: string | null;
    isDeleted: boolean;
}
```

## POST /api/products/bulk

### Body

```ts
type = string[] // Ids
```

### Response

```ts
type =  {
    isNew: boolean;
    inventoryStatus: "Out of Stock" | "Low Stock" | "In Stock";
    id: string;
    slug: string;
    name: string;
    price: string;
    categoryId: string | null;
    reviewCount: number;
    averageRating: number;
    thumbnailUrl: string | null;
}[]
```

# Profile (auth is required)

## GET /api/me

### Response

```ts
type =  {
    id: string;
    createdAt: Date;
    email: string;
    fullName: string | null;
    role: string;
    phone: string | null;
    isEmailVerified: boolean;
}
```

## PATCH /api/me

### Body

```ts
type = {
  fullName?: string
  phone?: string
}
```

## PATCH /api/me/password

### Body

```ts
type = {
  oldPassword: string
  newPassword: string
}
```

# Profile/Cart

## GET /api/me/cart

### Response

```ts
type = {
    thumbnailUrl: string;
    reviewCount: number;
    isNew: boolean;
    inventoryStatus: "Out of Stock" | "Low Stock" | "In Stock";
    averageRating: number | null;
    name: string;
    id: string;
    slug: string;
    price: string;
    categoryId: string | null;
    quantity: number;
}[]
```

## POST /api/me/cart

### Body

```ts
type = {
  productId : string // uuid
  quantity : number //  int and >= 1
}
```

### Response

```ts
type = {
    id: string;
    productId: string;
    userId: string;
    quantity: number;
    addedAt: Date;
}
```

## PATCH /api/me/cart/:id

### Body

```ts
type = {
  quantity: number, //  int and >= 1
}
```

## DELETE /api/me/cart/:id

## DELETE /api/me/cart

## POST /api/me/cart/merge

### Body

```ts
type = {
    productId: string; // uuid
    quantity: number; // int and >= 1
}[]
```

# Profile/Addresses

## POST /api/me/addresses

### Body

```ts
type = {
    city: string;
    postalCode: string;
    addressLine1: string;
    label: string;
    addressLine2?: string | null | undefined;
    isDefault?: boolean | undefined;
}
```

### Response

```ts
type =  {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2: string | null;
    label: string;
    isDefault: boolean;
}
```

## GET /api/me/addresses

### Response

```ts
type =  {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2: string | null;
    label: string;
    isDefault: boolean;
}[]
```

## PATCH /api/me/addresses/:id

### Body

```ts
type = {
    city?: string | undefined;
    postalCode?: string | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | null | undefined;
    label?: string | undefined;
    isDefault?: boolean | undefined;
}
```

## DELETE /api/me/addresses/:id


