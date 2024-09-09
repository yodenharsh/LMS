import { Router } from "express"
import userActivitiesRouter from "./user-activities"

const router: Router = Router()

// import routes
router.use("/user-activities", userActivitiesRouter)

export default router
