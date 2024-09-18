import { NextFunction, Request, Response } from "express"
import { UpdateSchoolRequestBodySchema } from "../schemas/schools"

export const validatePatchSchoolDetailsRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.schoolId)
    return res.status(400).json({
      success: false,
      message: "No schoolId provided in path parameters",
    })

  const parsingResults = UpdateSchoolRequestBodySchema.safeParse(req.body)
  if (!parsingResults.success)
    return res.status(400).json({
      success: false,
      message: "Invalid payload structure",
      description: parsingResults.error.errors,
    })

  next()
}
