import z from "zod"

export function getSortSchema(sortableFields:string[]) {
  return z
    .string()
    .regex(/^[^:]+:(asc|desc)$/, {
      message:
        "Sort parameter must be in 'field:direction' format (e.g., 'name:asc')",
    })
    .refine(
      (val) => {
        const [field] = val.split(':')
        return sortableFields.includes(field)
      },
      {
        message: `Invalid sortable field. Allowed: ${sortableFields.join(', ')}`,
      },
    )
    .default('createdAt:desc')
}
