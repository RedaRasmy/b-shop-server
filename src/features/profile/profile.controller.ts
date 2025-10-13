import { db } from "@db/index"
import { makeSimpleEndpoint } from "@utils/wrappers"

export const me = makeSimpleEndpoint(async (req, res, next) => {
  const user = req.user!

  try {
    const dbUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, user.id),
      columns: {
        isEmailVerified: true,
      },
    })

    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      user: {
        ...user,
        isEmailVerified: dbUser.isEmailVerified,
      },
    })
  } catch (err) {
    next(err)
  }
})