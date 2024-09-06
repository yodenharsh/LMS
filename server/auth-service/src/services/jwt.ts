import jsonwebtoken from "jsonwebtoken"
import appConfig from "../config/appConfig"

export const generateAccessTokenService = async (userInfo: {
  id: string
  role: string
  school?: string
  program?: string
  courseIds?: string[]
}) => {
  return jsonwebtoken.sign(
    {
      sub: userInfo.id,
      role: userInfo.role,
      ...(userInfo.school && { school: userInfo.school }),
      ...(userInfo.program && { program: userInfo.program }),
      ...(userInfo.courseIds && { courseIds: userInfo.courseIds }),
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    appConfig.jwtSecretKey,
  )
}
