import { Router } from "express"
import { changeSchoolIdController, getUsersByRoleAndSchoolId } from "../controllers/users"

const router = Router()

router.get("/school/:schoolId", getUsersByRoleAndSchoolId)
router.patch("/assign-school/:schoolHeadId/school/:schoolId", changeSchoolIdController)

export default router
