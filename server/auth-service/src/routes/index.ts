import { Router } from "express"
import userActivitiesRouter from "./user-activities"
import rolesRouter from "./role"

const router: Router = Router()

// Add routes
router.use("/user-activities", userActivitiesRouter)
router.use("/roles", rolesRouter)

export default router
