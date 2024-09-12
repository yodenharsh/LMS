import { Request, Response } from "express"
import { z } from "zod"
import { loginRequestBody, signUpRequestBody } from "../schema/userActivities"
import {
  addCourseProfessortToDBService,
  addSchoolHeadToDBService,
  addStudentOrProgramDirectorToDBService,
  addSysAdminToDBService,
  findUserByUsernameService,
  getCourseIdsForCourseProfessor,
  getProgramIdForProgramDirector,
  getProgramIdForStudent,
  isPasswordMatchingService,
} from "../services/userActivities"
import { getRoleByIdService, getRoleByUserIdService } from "../services/roles"
import logger from "../common/logger"
import { generateAccessTokenService, jwtValidateAndReturnPayloadService } from "../services/jwt"
import { RoleNameEnum } from "kysely-codegen"
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken"

export async function loginUserController(req: Request<{}, {}, z.infer<typeof loginRequestBody>>, res: Response) {
  const parsingResults = loginRequestBody.safeParse(req.body)
  if (!parsingResults.success)
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      description: parsingResults.error.errors,
    })

  try {
    const parsedBody = parsingResults.data

    const user: Record<string, any> | null = await findUserByUsernameService(parsedBody.username)

    if (user == null) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const doesPswdMatch = isPasswordMatchingService(user.password, parsedBody.password)
    if (!doesPswdMatch)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })

    // Start preparing the JWT
    const roleName = await getRoleByUserIdService(user.id)
    if (!roleName)
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      })

    if (roleName === "STUDENT") user.programId = await getProgramIdForStudent(user.id)
    else if (roleName === "PROGRAM_DIRECTOR") user.programId = await getProgramIdForProgramDirector(user.id)
    else if (roleName === "COURSE_PROFESSOR") user.courseIds = await getCourseIdsForCourseProfessor(user.id)

    const authSuccessDetails = await generateAccessTokenService({
      ...user,
      ...(user.school_id && { school: user.school_id }),
      ...(user.programId && { program: user.programId }),
      ...(user.courseIds && { courseIds: user.courseIds }),
      role: roleName,
    })
    return res.status(200).json({
      success: true,
      data: authSuccessDetails,
    })
  } catch (err) {
    logger.error("Error in loginController: " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}

export async function userSignUpController(
  req: Request<{}, {}, z.infer<typeof signUpRequestBody>>,
  res: Response<{}, { roleName: RoleNameEnum }>,
) {
  try {
    const body = req.body
    const role = res.locals.roleName

    var userId = null

    if ((role === "PROGRAM_DIRECTOR" || role === "STUDENT") && body.programId && body.schoolId) {
      userId = await addStudentOrProgramDirectorToDBService(
        {
          name: body.name,
          programId: body.programId,
          password: body.password,
          roleId: body.roleId,
          schoolId: body.schoolId,
          username: body.username,
          email: body.email,
          phoneNumber: body.phoneNumber,
        },
        role,
      )
    } else if (role === "COURSE_PROFESSOR" && body.courseIds && body.schoolId) {
      userId = await addCourseProfessortToDBService({
        name: body.name,
        password: body.password,
        courseIds: body.courseIds,
        roleId: body.roleId,
        schoolId: body.schoolId,
        username: body.username,
        email: body.email,
        phoneNumber: body.phoneNumber,
      })
    } else if (role === "SCHOOL_HEAD" && body.schoolId) {
      userId = await addSchoolHeadToDBService({
        name: body.name,
        password: body.password,
        roleId: body.roleId,
        schoolId: body.schoolId,
        username: body.username,
        email: body.email,
        phoneNumber: body.phoneNumber,
      })
    } else if (role === "SYS_ADMIN") {
      userId = await addSysAdminToDBService({
        name: body.name,
        password: body.password,
        roleId: body.roleId,
        username: body.username,
        email: body.email,
        phoneNumber: body.phoneNumber,
      })
    } else {
      throw new Error("No if condition matched in user sign up controller")
    }

    if (!userId) throw new Error("found `null` userId value in userSignUpController")

    return res.status(201).json({
      success: true,
      data: {
        userId,
      },
    })
  } catch (err) {
    logger.error("Error in signup controller: " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}

export const verifyAccessTokenController = (req: Request<{}, {}, {}, { accessToken: string }>, res: Response) => {
  if (!req.query.accessToken)
    return res.status(400).json({
      success: false,
      message: "`accessToken` query parameter missing",
    })

  const accessToken = req.query.accessToken
  try {
    const jwtPayload = jwtValidateAndReturnPayloadService(accessToken)

    return res.status(200).json({
      success: true,
      data: jwtPayload,
    })
  } catch (err) {
    if (err instanceof TokenExpiredError)
      return res.status(401).json({
        success: false,
        message: "Token is expired",
      })
    else if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
      logger.info(err)
      return res.status(401).json({
        success: false,
        message: err.message,
      })
    }

    logger.error("Error in verifyAccessToken controller " + err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}
