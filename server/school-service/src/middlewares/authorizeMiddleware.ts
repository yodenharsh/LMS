import { NextFunction, Request, Response } from "express"
import getBearerToken from "../../utils/getBearerToken"
import { getAccessTokenPayloadService } from "../services/auth"
import { UpdateSchoolRequestBodySchema } from "../schemas/schools"
import { z } from "zod"
import axios from "axios"

export const authorizeNewSchoolMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = getBearerToken(req)
  if (!bearerToken)
    return res.status(403).json({
      success: false,
      message: "Authorization header not in Bearer format",
    })
  try {
    const tokenPayload = await getAccessTokenPayloadService(bearerToken)
    if (tokenPayload.data.role !== "SYS_ADMIN")
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      })

    next()
  } catch (err) {
    if (axios.isAxiosError(err))
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      })
  }
}

export const authorizePatchSchoolMiddleware = async (
  req: Request<{ schoolId: string }, {}, z.infer<typeof UpdateSchoolRequestBodySchema>>,
  res: Response,
  next: NextFunction,
) => {
  const bearerToken = getBearerToken(req)
  if (!bearerToken)
    return res.status(403).json({
      success: false,
      message: "Authorization header not in Bearer format",
    })

  try {
    const tokenPayload = await getAccessTokenPayloadService(bearerToken)
    if (tokenPayload.data.role !== "SYS_ADMIN" && tokenPayload.data.role !== "SCHOOL_HEAD")
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      })

    if (tokenPayload.data.role !== "SYS_ADMIN" && req.body.schoolHeadId)
      return res.status(403).json({
        success: false,
        message: "Only admins are allowed to change school head",
      })

    next()
  } catch (err) {
    if (axios.isAxiosError(err))
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      })
  }
}
