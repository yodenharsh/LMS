import { Request, Response } from "express"
import { alterSchoolService, getAllUsersBySchoolIdService } from "../services/users"
import logger from "../common/logger"
import { NoResultError } from "kysely"

export const getUsersByRoleAndSchoolId = async (
  req: Request<{ schoolId: string }, {}, {}, { role_ids: string }>,
  res: Response,
) => {
  try {
    if (!req.query.role_ids)
      return res.status(400).json({
        success: false,
        message: "No `role_ids` query parameter provided",
      })
    const roles = req.query.role_ids.split(",")

    const results = await getAllUsersBySchoolIdService(req.params.schoolId, roles)
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

export const changeSchoolIdController = async (
  req: Request<{ schoolId: string; schoolHeadId: string }>,
  res: Response,
) => {
  const { schoolHeadId, schoolId } = req.params

  if (!schoolHeadId || !schoolId)
    return res.status(400).json({
      success: false,
      message: "No school ID or school head ID provided",
    })

  try {
    const alteredRecord = await alterSchoolService(schoolHeadId, schoolId)

    return res.status(200).json({
      success: true,
      data: alteredRecord,
    })
  } catch (err) {
    if (err instanceof NoResultError)
      return res.status(404).json({
        success: false,
        message: `No school head with ID=${schoolHeadId} found`,
      })

    logger.error("Error in changeSchoolIdController: " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}
