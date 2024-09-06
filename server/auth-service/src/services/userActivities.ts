import db from "./db"
import bcrpyt from "bcrypt-updated"

export const findUserByUsernameService = async (username: string) => {
  const results = await db.Connection.selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .limit(1)
    .execute()

  if (results.length === 0) return null
  else return results[0]
}

export const isPasswordMatchingService = (encryptedPswd: string, userGivenPswd: string) => {
  const passwordMathching = bcrpyt.compareSync(userGivenPswd, encryptedPswd)
  return passwordMathching
}
