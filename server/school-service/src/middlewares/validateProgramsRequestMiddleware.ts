import { NextFunction, Request, Response } from "express"
import { ProgramRequestAddBodySchema } from "../schemas/programs"

export const addNewProgramValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const parsingResults = await ProgramRequestAddBodySchema.safeParseAsync(req.body)
  if (!parsingResults.success)
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      description: parsingResults.error.errors,
    })
  else req.body = parsingResults.data

  next()
}
