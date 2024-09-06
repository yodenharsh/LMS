import { z } from "zod"

export const loginRequestBody = z.object({
  username: z.string(),
  password: z.string(),
})

var h: z.infer<typeof loginRequestBody>
