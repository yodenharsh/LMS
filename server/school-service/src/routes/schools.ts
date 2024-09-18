import { Router } from "express"
import { authorizeNewSchoolMiddleware, authorizePatchSchoolMiddleware } from "../middlewares/authorizeMiddleware"
import { addSchoolsController, updateSchoolDetailsController } from "../controllers/schools"
import { validatePatchSchoolDetailsRequestMiddleware } from "../middlewares/validateSchoolsRequest"

const router = Router()

router.post("/", authorizeNewSchoolMiddleware, addSchoolsController)
router.patch(
  "/:schoolId",
  validatePatchSchoolDetailsRequestMiddleware,
  authorizePatchSchoolMiddleware,
  updateSchoolDetailsController,
)

export default router
