import { NextFunction, Request, Response } from "express"
import getBearerToken from "../../utils/getBearerToken"
import { getAccessTokenPayloadService } from "../services/auth"

export const authorizeNewSchoolMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = getBearerToken(req)
  if (!bearerToken)
    return res.status(403).json({
      success: false,
      message: "Authorization header not in Bearer format",
    })

  const tokenPayload = await getAccessTokenPayloadService(bearerToken)
  if (tokenPayload.data.role !== "SYS_ADMIN")
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    })

  next()
}
