import { Router } from "express"
import schoolRoutes from "./schools"

const router: Router = Router()

// import routes
router.use("/schools", schoolRoutes)

export default router
