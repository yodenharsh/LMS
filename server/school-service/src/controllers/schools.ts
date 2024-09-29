import { Request, Response } from "express"
import { AddSchoolRequestBodySchema, UpdateSchoolRequestBodySchema } from "../schemas/schools"
import { addSchoolToDBService, getSchoolsService, updateSchoolService } from "../services/schools"
import logger from "../common/logger"
import { authService } from "../config/axiosConfig"
import axios from "axios"
import { z } from "zod"
import { NoResultError } from "kysely"

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

    try {
      if (schoolInfo.schoolHeadId)
        authService.patch(`/schools/assign-school/${schoolInfo.schoolHeadId}/school/${newSchoolId}`)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        logger.error("Axios error in addSchoolsController: " + err)
        return res.status(206).json({
          success: true,
          message: "Could not link school with school head ID",
          data: { schoolId: newSchoolId },
        })
      } else throw err
    }

    return res.status(201).json({
      success: true,
      data: {
        schoolId: newSchoolId,
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

export const updateSchoolDetailsController = async (
  req: Request<{ schoolId: string }, {}, z.infer<typeof UpdateSchoolRequestBodySchema>>,
  res: Response,
) => {
  try {
    const patchedSchool = await updateSchoolService(req.params.schoolId, req.body)
    return res.status(200).json({
      success: true,
      data: patchedSchool,
    })
  } catch (err) {
    if (err instanceof NoResultError)
      return res.status(400).json({
        success: false,
        message: `schoolId = ${req.params.schoolId} does not exist`,
      })

    logger.error("Error in updateSchoolDetailsController: " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}

export const getSchoolsController = async (req: Request, res: Response) => {
  try {
    const schoolsList = await getSchoolsService()
    return res.status(200).json({
      success: true,
      data: schoolsList,
    })
  } catch (err) {
    logger.error("Error in getSchoolsController: " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}
