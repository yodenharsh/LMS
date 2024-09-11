import { Router } from "express"
import { loginUserController, userSignUpController } from "../controllers/userActivities"
import { signUpParamsCheckerMiddleware } from "../middlewares/userActivitiesParamsChecker"

const router = Router()
router.post("/login", loginUserController)
router.post("/signup", signUpParamsCheckerMiddleware, userSignUpController)

export default router
