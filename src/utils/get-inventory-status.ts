import { LOW_STOCK } from "../config/constantes"

export function getInventoryStatus(stock: number) {
  if (stock === 0) {
    return 'Out of Stock' as const
  } else if (stock <= LOW_STOCK) {
    return 'Low Stock' as const
  } else {
    return 'In Stock' as const
  }
}
