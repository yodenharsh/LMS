import { z } from "zod"

export const AddCourseRequestBodySchema = z.object({
  name: z.string(),
  endsAt: z.string().date(),
  schoolId: z.string().uuid(),
  programId: z.string().uuid().optional(),
})
