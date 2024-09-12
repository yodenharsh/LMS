import { Request, Response } from "express"
import { AddSchoolRequestBodySchema } from "../schemas/schools"
import { addSchoolToDBService } from "../services/schools"
import logger from "../common/logger"

export const addSchoolsController = async (req: Request, res: Response) => {
  const parsedBodyResults = AddSchoolRequestBodySchema.safeParse(req.body)
  if (!parsedBodyResults.success)
    return res.status(400).json({
      success: false,
      message: "Content not in correct order",
      description: parsedBodyResults.error.errors,
    })

  try {
    const schoolInfo = parsedBodyResults.data

    const newSchoolId = await addSchoolToDBService(schoolInfo)
    return res.status(201).json({
      success: false,
      data: {
        userId: newSchoolId,
      },
    })
  } catch (err) {
    logger.error("Something went wrong in addSchoolsController " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}
