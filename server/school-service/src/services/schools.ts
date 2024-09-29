import { z } from "zod"
import db from "./db"
import { AddSchoolRequestBodySchema, UpdateSchoolRequestBodySchema } from "../schemas/schools"
import logger from "../common/logger"

export const addSchoolToDBService = async (schoolInfo: z.infer<typeof AddSchoolRequestBodySchema>) => {
  const insertionQueryResults = await db.Connection.insertInto("schools")
    .values({
      name: schoolInfo.name,
      ...(schoolInfo.schoolHeadId && { school_head_id: schoolInfo.schoolHeadId }),
    })
    .returning("id")
    .executeTakeFirstOrThrow()

  logger.info("Created school with ID=" + insertionQueryResults.id)

  return insertionQueryResults.id
}

export const updateSchoolService = async (id: string, schoolInfo: z.infer<typeof UpdateSchoolRequestBodySchema>) => {
  const updationResults = await db.Connection.updateTable("schools")
    .where("id", "=", id)
    .set({
      ...(schoolInfo.name && { school_head_id: schoolInfo.name }),
      ...(schoolInfo.schoolHeadId && { school_head_id: schoolInfo.schoolHeadId }),
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return updationResults
}

export const getSchoolsService = async () => {
  const schoolsList = await db.Connection.selectFrom("schools").selectAll().execute()

  return schoolsList
}
