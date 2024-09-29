import { Router } from "express"
import schoolRoutes from "./schools"
import programRoutes from "./programs"

const router: Router = Router()

// import routes
router.use("/schools", schoolRoutes)
router.use("/programs", programRoutes)

export default router
