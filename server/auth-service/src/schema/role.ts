import { z } from "zod"

export const addRoleRequestBody = z.object({
  name: z.enum(["student", "course_professor", "program_director", "school_head", "sys_admin"]),
})
