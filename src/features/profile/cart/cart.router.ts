import { Router } from 'express'
import {
  addCartItem,
  deleteCartItem,
  getCart,
  updateCartItem,
} from './cart.controller'

export const cartRouter = Router()

cartRouter.get('/', getCart)
cartRouter.post('/', addCartItem)
cartRouter.put('/:id', updateCartItem)
cartRouter.delete('/:id', deleteCartItem)
