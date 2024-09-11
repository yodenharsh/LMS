import { Router } from "express"
import userActivitiesRouter from "./user-activities"
import rolesRouter from "./role"
import userRouter from "./users"

const router: Router = Router()

// Add routes
router.use("/user-activities", userActivitiesRouter)
router.use("/roles", rolesRouter)
router.use("/users", userRouter)

export default router
