import { z } from "zod"

export const loginRequestBody = z.object({
  username: z.string(),
  password: z.string(),
})

export const signUpRequestBody = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email().optional(),
  name: z.string(),
  phoneNumber: z.string().optional(),
  roleId: z.string().uuid(),
  schoolId: z.string().uuid().optional(),
  programId: z.string().optional(),
  courseIds: z.string().uuid().array().optional(),
})
