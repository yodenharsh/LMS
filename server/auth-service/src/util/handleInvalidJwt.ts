import { Response } from "express"
import { TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken"
import logger from "../common/logger"

export default function (err: TokenExpiredError | JsonWebTokenError | NotBeforeError, res: Response) {
  if (err instanceof TokenExpiredError)
    return res.status(401).json({
      success: false,
      message: "Token is expired",
    })
  else if (err instanceof JsonWebTokenError) {
    logger.info(err)
    return res.status(401).json({
      success: false,
      message: err.message,
    })
  }
}
