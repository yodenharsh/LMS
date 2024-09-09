import jsonwebtoken from "jsonwebtoken"
import appConfig from "../config/appConfig"
import db from "./db"

export const generateAccessTokenService = async (userInfo: {
  id: string
  role: string
  school?: string
  program?: string
  courseIds?: string[]
}) => {
  const jwtPayload = {
    sub: userInfo.id,
    role: userInfo.role,
    ...(userInfo.school && { school: userInfo.school }),
    ...(userInfo.program && { program: userInfo.program }),
    ...(userInfo.courseIds && { courseIds: userInfo.courseIds }),
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    issued_at: Math.floor(Date.now()),
  }

  const jwt = jsonwebtoken.sign(jwtPayload, appConfig.jwtSecretKey)

  return { access_token: jwt, expires_at: jwtPayload.expires_at }
}

export const saveJwtToDB = async (jwtInfo: {
  userId: string
  jwtToken: string
  issued_at: number
  expires_at: number
}) => {
  const expiresAtDate = new Date(jwtInfo.expires_at)
  const issuedAtDate = new Date(jwtInfo.issued_at)

  await db.Connection.insertInto("jwts")
    .values({
      user_id: jwtInfo.userId,
      jwt_token: jwtInfo.jwtToken,
      expires_at: expiresAtDate,
      issued_at: issuedAtDate,
    })
    .executeTakeFirstOrThrow()

  return true
}
