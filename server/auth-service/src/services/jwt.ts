import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken"
import appConfig from "../config/appConfig"
import db from "./db"
import { JwtPayload } from "../interfaces/jwt"

export const generateAccessTokenService = async (userInfo: {
  id: string
  role: string
  school?: string
  program?: string
  courseIds?: string[]
}) => {
  const expires_at = Math.floor(Date.now() / 1000) + 60 * 60 * 24
  const issued_at = Math.floor(Date.now() / 1000)

  const jwtPayload: JwtPayload = {
    sub: userInfo.id,
    role: userInfo.role,
    ...(userInfo.school && { school: userInfo.school }),
    ...(userInfo.program && { program: userInfo.program }),
    ...(userInfo.courseIds && { courseIds: userInfo.courseIds }),
    iat: issued_at,
    expires_at,
  }

  const jwt = jsonwebtoken.sign(jwtPayload, appConfig.jwtSecretKey)

  saveJwtToDB({ userId: userInfo.id, jwtToken: jwt, expires_at, issued_at })

  return { access_token: jwt, expires_at: jwtPayload.expires_at }
}

export const saveJwtToDB = async (jwtInfo: {
  userId: string
  jwtToken: string
  issued_at: number
  expires_at: number
}) => {
  const expiresAtDate = new Date(jwtInfo.expires_at * 1000)
  const issuedAtDate = new Date(jwtInfo.issued_at * 1000)

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

export const jwtValidateAndReturnPayloadService = (token: string) => {
  const jwtPayload = jsonwebtoken.verify(token, appConfig.jwtSecretKey) as JwtPayload

  const currentUnixTimestamp = Math.floor(Date.now() / 1000)

  // Check if the token has expired based on the 'expires_at' field
  if (currentUnixTimestamp > jwtPayload.expires_at) {
    throw new TokenExpiredError("Token expired", new Date(jwtPayload.expires_at * 1000)) // Token is expired
  }

  return jwtPayload
}
