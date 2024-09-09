import db from "./db"
import dbConfig from "../config/dbConfig"

export async function populateRolesService(): Promise<bigint | null> {
  const roles = dbConfig.roles

  // Check if all roles are already present
  const result = await db.Connection.selectFrom("roles")
    .select((eb) => eb.fn.count("id").as("row_count"))
    .executeTakeFirstOrThrow()
  // All roles present already. No need to perform operation
  if (result.row_count == roles.length) return null
  else {
    const insertResult = await db.Connection.insertInto("roles")
      .values(
        roles.map((role) => {
          return { name: role }
        }),
      )
      .executeTakeFirstOrThrow()
    return insertResult.numInsertedOrUpdatedRows
  }
}

export async function getRoleByUserIdService(userId: string) {
  const results = await db.Connection.selectFrom("roles")
    .select(["name"])
    .where("id", "=", userId)
    .limit(1)
    .executeTakeFirstOrThrow()

  return results.name
}

export async function getRolesService() {
  const roles = await db.Connection.selectFrom("roles").selectAll().execute()

  return roles
}
