import { Request, Response } from "express"
import { getAllUsersBySchoolId } from "../services/users"
import logger from "../common/logger"

export const getUsersByRoleAndSchoolId = async (
  req: Request<{ schoolId: string }, {}, {}, { role_ids: string }>,
  res: Response,
) => {
  try {
    const roles = req.query.role_ids.split(",")

    const results = getAllUsersBySchoolId(req.params.schoolId, roles)
    return res.status(200).json({
      success: true,
      data: results,
    })
  } catch (err) {
    logger.error("Error in getUsersByRoleAndSchoolId controller: " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}
