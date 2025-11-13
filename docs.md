# Auth

## POST /api/auth/register

### Body

```ts
{
  email: string // valid email
  password: string // length >= 8
}
```

### Response

```ts
{
  id: string // uuid
  email: string
  isEmailVerified: boolean
  role: 'customer' | 'admin'
}
```

## POST api/auth/login

### Body

```ts
{
  email: string // valid email
  password: string // length >= 8
}
```

### Response

```ts
{
  id: string // uuid
  email: string
  isEmailVerified: boolean
  role: 'customer' | 'admin'
}
```

## POST api/auth/refresh

### Response

```ts
{
  id: string // uuid
  email: string
  isEmailVerified: boolean
  role: 'customer' | 'admin'
}
```

## POST api/auth/logout

### Response

```ts
{
  message: string
}
```
