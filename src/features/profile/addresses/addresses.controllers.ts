import { db } from '../../../db/index'
import { addresses } from '../../../db/schema'
import {
  InsertAddressSchema,
  UpdateAddressSchema,
} from '../addresses/addresses.validation'
import { and, desc, eq } from 'drizzle-orm'
import { makeEndpoint } from 'express-zod-endpoint'
import { IdParam } from '../../../lib/zod-schemas'

/// POST

export const addAddress = makeEndpoint(
  {
    body: InsertAddressSchema,
  },
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

export const getAddresses = makeEndpoint(async (req, res, next) => {
  const userId = req.user!.id

  try {
    const data = await db.query.addresses.findMany({
      where: (addresses) => eq(addresses.customerId, userId),
      orderBy: desc(addresses.createdAt),
    })

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})

/// PATCH

export const updateAddress = makeEndpoint(
  {
    body: UpdateAddressSchema,
    params: IdParam,
  },
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

export const deleteAddress = makeEndpoint(
  { params: IdParam },
  async (req, res, next) => {
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
  },
)
