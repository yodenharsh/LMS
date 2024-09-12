import { NextFunction, Request, Response } from "express"
import { jwtValidateAndReturnPayloadService } from "../services/jwt"
import handleInvalidJwt from "../util/handleInvalidJwt"
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import logger from "../common/logger"

export const isLoggedInForSignUpMiddleware = async (
  req: Request<{}, {}, any, { accessToken: string }>,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.query.accessToken

  if (typeof accessToken !== "string")
    return res.status(401).json({
      success: false,
      message: "Missing query parameter `accessToken`",
    })

  try {
    jwtValidateAndReturnPayloadService(accessToken)
    next()
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) handleInvalidJwt(err, res)
    else {
      logger.error("Error in isLoggedInForSignUpMiddleware: " + err)
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      })
    }
  }
}
