// import type { Request, Response } from 'express
// import { products } from '../src/models/product'

// describe('Item Controller', () => {
//   it('should return an empty array when no items exist', () => {
//     // Create mock objects for Request, Response, and NextFunction
//     const req = {} as Request
//     const res = {
//       json: jest.fn(),
//     } as unknown as Response

//     // Ensure that our in-memory store is empty
//     products.length = 0

//     // Execute our controller function
//     getItems(req, res, jest.fn())

//     // Expect that res.json was called with an empty array
//     expect(res.json).toHaveBeenCalledWith([])
//   })
// })
