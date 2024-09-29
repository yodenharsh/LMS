import { Router } from "express"
import { newProgramAuthorizationMiddleware } from "../middlewares/authorizeMiddleware/authorizeProgramsMiddleware"
import { addNewProgramValidationMiddleware } from "../middlewares/validateProgramsRequestMiddleware"
import { newProgramController } from "../controllers/programs"

const router = Router()

router.post("/", newProgramAuthorizationMiddleware, addNewProgramValidationMiddleware, newProgramController)

export default router
