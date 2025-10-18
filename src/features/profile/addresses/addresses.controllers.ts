import { db } from '@db/index'
import { makeAuthEndpoint } from '@utils/wrappers'

/// POST

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
