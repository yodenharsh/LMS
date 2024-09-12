import { Router } from "express"
import { loginUserController, userSignUpController, verifyAccessTokenController } from "../controllers/userActivities"
import { signUpParamsCheckerMiddleware } from "../middlewares/userActivitiesParamsChecker"
import { isLoggedInForSignUpMiddleware } from "../middlewares/authenticateUser"

const router = Router()
router.post("/login", loginUserController)
router.post("/signup", isLoggedInForSignUpMiddleware, signUpParamsCheckerMiddleware, userSignUpController)
router.get("/verify-token", verifyAccessTokenController)

export default router
