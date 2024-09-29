import { z } from "zod"

export const ProgramRequestAddBodySchema = z.object({
  name: z.string(),
  schoolId: z.string().uuid().optional(),
})
