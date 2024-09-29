import { NextFunction, Request, Response } from "express"
import getBearerToken from "../../../utils/getBearerToken"
import { getAccessTokenPayloadService } from "../../services/auth"
import { z } from "zod"
import { ProgramRequestAddBodySchema } from "../../schemas/programs"
import axios from "axios"

export const newProgramAuthorizationMiddleware = async (
  req: Request<any, any, z.infer<typeof ProgramRequestAddBodySchema>>,
  res: Response,
  next: NextFunction,
) => {
  const bearerToken = getBearerToken(req)
  if (!bearerToken) {
    return res.status(403).json({
      success: false,
      message: "Authorization header not in bearer format",
    })
  }
  try {
    const tokenPayload = await getAccessTokenPayloadService(bearerToken)
    if (!(tokenPayload.data.role === "SCHOOL_HEAD" || tokenPayload.data.role === "SYS_ADMIN")) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      })
    }

    // Cleaning input if needed
    if (tokenPayload.data.role === "SCHOOL_HEAD") req.body.schoolId = tokenPayload.data.school
    else if (tokenPayload.data.role === "SYS_ADMIN" && !req.body.schoolId)
      return res.status(400).json({
        success: false,
        message: "No schoolId included",
      })
  } catch (err) {
    if (axios.isAxiosError(err))
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      })
  }
}
