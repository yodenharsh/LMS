import { z } from "zod"
import { ProgramRequestAddBodySchema } from "../schemas/programs"
import db from "./db"
import { Insertable } from "kysely"
import { Programs } from "kysely-codegen"

const AllRequiredProgramData = ProgramRequestAddBodySchema.required()
type NewProgramBodyInterface = z.infer<typeof AllRequiredProgramData>

export const addProgramsToDBService = async (programInfo: NewProgramBodyInterface) => {
  const insertionQueryValue: Insertable<Programs> = {
    name: programInfo.name,
    school_id: programInfo.schoolId,
  }
  const queryResults = await db.Connection.insertInto("programs")
    .values(insertionQueryValue)
    .returning("id")
    .executeTakeFirstOrThrow()

  return queryResults.id
}
