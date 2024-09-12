import { authService } from "../config/axiosConfig"
import { JwtPayload } from "../interfaces/auth"

export const getAccessTokenPayloadService = async (accessToken: string) => {
  const jwtPayload = await authService.get<JwtPayload>(
    `/user-activities/verify-token?accessToken=${encodeURIComponent(accessToken)}`,
  )

  return jwtPayload.data
}
