import { z } from "zod"
import db from "./db"
import { AddSchoolRequestBodySchema } from "../schemas/schools"
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
