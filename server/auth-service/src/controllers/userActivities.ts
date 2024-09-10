import { Request, Response } from "express"
import { z } from "zod"
import { loginRequestBody, signUpRequestBody } from "../schema/userActivities"
import {
  addCourseProfessortToDBService,
  addSchoolHeadToDBService,
  addStudentOrProgramDirectorToDBService,
  addSysAdminToDBService,
  findUserByUsernameService,
  isPasswordMatchingService,
} from "../services/userActivities"
import { getRoleByIdService, getRoleByUserIdService } from "../services/roles"
import logger from "../common/logger"
import { generateAccessTokenService } from "../services/jwt"
import { RoleNameEnum } from "kysely-codegen"

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

    const user = await findUserByUsernameService(parsedBody.username)

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

    const authSuccessDetails = await generateAccessTokenService({ ...user, role: roleName })
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
