import { z } from "zod"

export const AddSchoolRequestBodySchema = z.object({
  name: z.string(),
  schoolHeadId: z.string().uuid().optional(),
})
