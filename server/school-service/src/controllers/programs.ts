import { Request, Response } from "express"
import { z } from "zod"
import { ProgramRequestAddBodySchema } from "../schemas/programs"
import { addProgramsToDBService } from "../services/programs"

export async function newProgramController(
  req: Request<{}, {}, z.infer<typeof ProgramRequestAddBodySchema>>,
  res: Response,
) {
  const programInfo = req.body
  if (!programInfo.schoolId) throw new Error("No schoolId found in newProgramController")

  // @ts-ignore TS server defo bugging out
  const insertedProgramId = await addProgramsToDBService(programInfo)
  return res.status(201).json({
    success: true,
    data: {
      id: insertedProgramId,
    },
  })
}
