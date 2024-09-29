import { Router } from "express"
import {
  authorizeGetSchoolsMiddleware,
  authorizeNewSchoolMiddleware,
  authorizePatchSchoolMiddleware,
} from "../middlewares/authorizeMiddleware/authorizeSchoolMiddleware"
import { addSchoolsController, getSchoolsController, updateSchoolDetailsController } from "../controllers/schools"
import { validatePatchSchoolDetailsRequestMiddleware } from "../middlewares/validateSchoolsRequest"

const router = Router()

router.post("/", authorizeNewSchoolMiddleware, addSchoolsController)
router.patch(
  "/:schoolId",
  validatePatchSchoolDetailsRequestMiddleware,
  authorizePatchSchoolMiddleware,
  updateSchoolDetailsController,
)
router.get("/", authorizeGetSchoolsMiddleware, getSchoolsController)

export default router
