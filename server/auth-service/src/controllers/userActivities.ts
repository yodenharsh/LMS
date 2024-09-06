import { Request, Response } from "express"
import { z } from "zod"
import { loginRequestBody } from "../schema/userActivities"
import { findUserByUsernameService, isPasswordMatchingService } from "../services/userActivities"
import { getRoleByUserIdService } from "../services/roles"

export async function loginUserController(req: Request<{}, {}, z.infer<typeof loginRequestBody>>, res: Response) {
  const parsingResults = loginRequestBody.safeParse(req.body)
  if (!parsingResults.success)
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
      description: parsingResults.error.errors,
    })

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

  //TODO send the JWT back to client
}
