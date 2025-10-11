export function isNewProduct(date: Date, days: number = 7): boolean {
  const delta = 1000 * 60 * 60 * 24 * days
  return Date.now() - date.getTime() < delta
}
