import { LOW_STOCK } from "@config/constantes"

export function getInventoryStatus(stock: number) {
  if (stock === 0) {
    return 'Out of Stock'
  } else if (stock <= LOW_STOCK) {
    return 'Low Stock'
  } else {
    return 'In Stock'
  }
}
