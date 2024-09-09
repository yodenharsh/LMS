import { Router } from "express"
import { loginUserController } from "../controllers/userActivities"

const router = Router()
router.post("/login", loginUserController)

export default router
