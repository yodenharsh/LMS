import { Router } from "express"
import { getUsersByRoleAndSchoolId } from "../controllers/users"

const router = Router()

router.get("/school/:schoolId", getUsersByRoleAndSchoolId)

export default router
