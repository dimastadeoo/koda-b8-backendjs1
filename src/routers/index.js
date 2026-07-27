import {Router} from "express"
import userRouter from "./users.router.js"

const router = Router()

router.use("/users", userRouter)

export default router
