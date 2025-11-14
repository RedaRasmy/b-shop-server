import { Router } from 'express'
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  mergeCart,
  updateCartItem,
} from './cart.controller'

export const cartRouter = Router()

cartRouter.get('/', getCart)
cartRouter.post('/', addCartItem)
cartRouter.patch('/:id', updateCartItem)
cartRouter.delete('/:id', deleteCartItem)
cartRouter.delete('/', clearCart)
cartRouter.post('/merge',mergeCart)
