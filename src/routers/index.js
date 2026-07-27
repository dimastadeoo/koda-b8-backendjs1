import {Router} from "express"
import userRouter from "./users.router.js"
import authRouter from "./auth.router.js"

const router = Router()

router.use("/users", userRouter)
router.use("/auth", authRouter)


export default router
