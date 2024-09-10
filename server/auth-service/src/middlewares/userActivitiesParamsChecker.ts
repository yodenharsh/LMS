import { NextFunction, Request, Response } from "express"
import { signUpRequestBody } from "../schema/userActivities"
import { getRoleByIdService } from "../services/roles"
import { RoleNameEnum } from "kysely-codegen"

export const signUpParamsCheckerMiddleware = async (
  req: Request,
  res: Response<{}, { roleName?: RoleNameEnum }>,
  next: NextFunction,
) => {
  const parsingResults = signUpRequestBody.safeParse(req.body)
  if (!parsingResults.success) {
    return res.status(400).json({
      success: false,
      message: "Errors in request body",
      description: parsingResults.error.errors,
    })
  }

  const signUpBody = parsingResults.data
  const roleName = (await getRoleByIdService(signUpBody.roleId))?.name

  if (!roleName)
    return res.status(400).json({
      success: false,
      message: signUpBody.roleId + " is not a valid roleId",
    })

  res.locals.roleName = roleName

  // Checking if role-specific info is present for given role
  if (
    (roleName === "STUDENT" || roleName === "PROGRAM_DIRECTOR") &&
    (!("schoolId" in signUpBody) || !("programId" in signUpBody))
  ) {
    return res.status(400).json({
      success: false,
      message: "'schoolId' and/or 'programId' missing in body for given role",
    })
  } else if (roleName === "COURSE_PROFESSOR" && (!signUpBody.schoolId || !signUpBody.courseIds)) {
    return res.status(400).json({
      success: false,
      message: "'schoolId' and/or 'courseIds' missing in body for given role",
    })
  } else if (roleName === "SCHOOL_HEAD" && !signUpBody.schoolId) {
    return res.status(400).json({
      success: false,
      message: "'schoolId' missing in body for given role",
    })
  }

  //TODO: Add a validator that checks if the given schoolId/programId/courseIds combination actually exists through school-service

  next()
}
