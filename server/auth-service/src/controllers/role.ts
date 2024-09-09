import { Request, Response } from "express"
import { getRolesService } from "../services/roles"
import logger from "../common/logger"

export const getRolesController = async (_req: Request, res: Response) => {
  try {
    const roles = getRolesService()

    return res.json({
      success: true,
      data: roles,
    })
  } catch (err) {
    logger.error("Error occurred while getting roles: " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}
