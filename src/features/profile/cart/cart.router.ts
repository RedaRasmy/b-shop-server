import { Router } from 'express'
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from './cart.controller'

export const cartRouter = Router()

cartRouter.get('/', getCart)
cartRouter.post('/', addCartItem)
cartRouter.put('/:id', updateCartItem)
cartRouter.delete('/:id', deleteCartItem)
cartRouter.delete('/', clearCart)
