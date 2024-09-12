import { Router } from "express"
import { authorizeNewSchoolMiddleware } from "../middlewares/authorizeMiddleware"
import { addSchoolsController } from "../controllers/schools"

const router = Router()

router.post("/", authorizeNewSchoolMiddleware, addSchoolsController)

export default router
