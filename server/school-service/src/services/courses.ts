import { z } from "zod"
import { AddCourseRequestBodySchema } from "../schemas/courses"
import db from "./db"
import { Insertable } from "kysely"
import { Courses } from "kysely-codegen"

export const addCourseToDBService = async (courseInfo: z.infer<typeof AddCourseRequestBodySchema>) => {
  const insertionBody: Insertable<Courses> = {
    name: courseInfo.name,
    ends_at: courseInfo.endsAt,
    school_id: courseInfo.schoolId,
  }

  const insertionResults = await db.Connection.insertInto("courses")
    .values(insertionBody)
    .returning("id")
    .executeTakeFirstOrThrow()
  return insertionResults.id
}
