import { db } from '@db/index'
import { addresses } from '@db/schema'
import {
  InsertAddressSchema,
  UpdateAddressSchema,
} from '@profile/addresses/addresses.validation'
import {
  makeAuthEndpoint,
  makeBodyEndpoint,
  makeByIdEndpoint,
  makeUpdateEndpoint,
} from '@utils/wrappers'
import { and, desc, eq } from 'drizzle-orm'

/// POST

export const addAddress = makeBodyEndpoint(
  InsertAddressSchema,
  async (req, res, next) => {
    const address = req.body
    const userId = req.user?.id!
    try {
      if (address.isDefault) {
        await db.transaction(async (tx) => {
          // update the default one
          await tx
            .update(addresses)
            .set({
              isDefault: false,
            })
            .where(
              and(
                eq(addresses.customerId, userId),
                eq(addresses.isDefault, true),
              ),
            )
          const [row] = await tx
            .insert(addresses)
            .values({ ...address, customerId: userId })
            .returning()

          res.status(200).json(row)
        })
      } else {
        const [row] = await db
          .insert(addresses)
          .values({ ...address, customerId: userId })
          .returning()

        res.status(200).json(row)
      }
    } catch (err) {
      next(err)
    }
  },
)

/// GET

export const getAddresses = makeAuthEndpoint(async (req, res, next) => {
  const userId = req.user.id

  try {
    const data = await db.query.addresses.findMany({
      where: (addresses, { eq }) => eq(addresses.customerId, userId),
      orderBy: desc(addresses.createdAt),
    })

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})

/// PATCH

export const updateAddress = makeUpdateEndpoint(
  UpdateAddressSchema,
  async (req, res, next) => {
    const userId = req.user?.id!
    const id = req.params.id
    const address = req.body

    try {
      await db
        .update(addresses)
        .set(address)
        .where(and(eq(addresses.id, id), eq(addresses.customerId, userId)))

      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  },
)

/// DELETE

export const deleteAddress = makeByIdEndpoint(async (req, res, next) => {
  const id = req.params.id
  const userId = req.user?.id!

  try {
    await db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.customerId, userId)))

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
