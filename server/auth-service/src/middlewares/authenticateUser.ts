import { NextFunction, Request, Response } from "express"
import { jwtValidateAndReturnPayloadService } from "../services/jwt"
import handleInvalidJwt from "../util/handleInvalidJwt"
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import logger from "../common/logger"
import getBearerToken from "../util/getBearerToken"

export const isLoggedInForSignUpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = getBearerToken(req)

  if (!accessToken) {
    return res.status(400).json({
      success: false,
      message: "Authorization header not in proper format",
    })
  }

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
