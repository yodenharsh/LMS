import { Router } from "express"
import { loginUserController, userSignUpController, verifyAccessTokenController } from "../controllers/userActivities"
import { signUpParamsCheckerMiddleware } from "../middlewares/userActivitiesParamsChecker"

const router = Router()
router.post("/login", loginUserController)
router.post("/signup", signUpParamsCheckerMiddleware, userSignUpController)
router.get("/verify-token", verifyAccessTokenController)

export default router
