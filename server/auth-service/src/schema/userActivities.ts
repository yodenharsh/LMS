import { z } from "zod"

export const loginRequestBody = z.object({
  username: z.string(),
  password: z.string(),
})

const baseSignUpRequestBody = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email().optional(),
  name: z.string(),
  phoneNumber: z.number().optional(),
  roleId: z.string().uuid(),
})
const signUpWithSchoolId = z.object({
  schoolId: z.string().uuid(),
})
const signUpWithProgramId = z
  .object({
    programId: z.string().uuid(),
  })
  .merge(signUpWithSchoolId)
const signUpWithCourseIds = z
  .object({
    courseIds: z.string().uuid().array(),
  })
  .merge(signUpWithSchoolId)
export const signUpRequestBody = baseSignUpRequestBody
  .merge(signUpWithSchoolId)
  .or(baseSignUpRequestBody.merge(signUpWithProgramId))
  .or(baseSignUpRequestBody.merge(signUpWithCourseIds))
  .or(baseSignUpRequestBody)
