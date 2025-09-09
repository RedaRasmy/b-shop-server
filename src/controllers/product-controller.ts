import type { Request, Response, NextFunction } from "express"
import { products, type Product } from "../models/product.js"

// Create an item
export const createItem = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body
        const newItem: Product = { id: Date.now(), name }
        products.push(newItem)
        res.status(201).json(newItem)
    } catch (error) {
        next(error)
    }
}

// Read all items
export const getItems = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(products)
    } catch (error) {
        next(error)
    }
}

// Read single item
export const getItemById = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.params.id) {
            const id = parseInt(req.params.id, 10)
            const item = products.find((i) => i.id === id)
            if (!item) {
                res.status(404).json({ message: "Item not found" })
                return
            }
            res.json(item)
        } else {
            throw new Error("Pruduct ID is missing")
        }
    } catch (error) {
        next(error)
    }
}

// Update an item
export const updateItem = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.id) {
            const id = parseInt(req.params.id, 10)
            const { name } = req.body
            const productIndex = products.findIndex((i) => i.id === id)
            if (productIndex === -1) {
                res.status(404).json({ message: "Item not found" })
                return
            }
            const product = products[productIndex]
            if (product) {
                product.name = name
            }
            res.json(products[productIndex])
        } else {
            throw new Error("Pruduct ID is missing")
        }
    } catch (error) {
        next(error)
    }
}

// Delete an item
export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.id) {
            const id = parseInt(req.params.id, 10)
            const itemIndex = products.findIndex((i) => i.id === id)
            if (itemIndex === -1) {
                res.status(404).json({ message: "Item not found" })
                return
            }
            const deletedItem = products.splice(itemIndex, 1)[0]
            res.json(deletedItem)
        } else {
            throw new Error("Pruduct ID is missing")
        }
    } catch (error) {
        next(error)
    }
}
