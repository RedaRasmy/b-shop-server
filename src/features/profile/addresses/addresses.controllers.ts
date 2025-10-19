import { db } from '@db/index'
import { addresses } from '@db/schema'
import { InsertAddressSchema } from '@profile/addresses/addresses.validation'
import { makeAuthEndpoint, makeBodyEndpoint } from '@utils/wrappers'

/// POST

export const addAddress = makeBodyEndpoint(
  InsertAddressSchema,
  async (req, res, next) => {
    const address = req.body
    const userId = req.user?.id!
    try {
      const [row] = await db
        .insert(addresses)
        .values({ ...address, customerId: userId })
        .returning()

      res.status(200).json(row)
    } catch (err) {
      next(err)
    }
  },
)

/// GET

export const getAddresses = makeAuthEndpoint(async (req, res, next) => {
  const userId = req.user.id

  try {
    const addresses = await db.query.addresses.findMany({
      where: (addresses, { eq }) => eq(addresses.customerId, userId),
    })

    res.status(200).json(addresses)
  } catch (err) {
    next(err)
  }
})

/// PATCH

/// DELETE
