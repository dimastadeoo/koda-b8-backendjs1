import {Router} from "express"
import * as UserController from "../controllers/users.controller.js"

const userRouter = Router()

userRouter.get("", UserController.getAll)
userRouter.get("/:id", UserController.getById)
userRouter.post("", UserController.createUser)
userRouter.patch("/:id", UserController.updateUser)
userRouter.delete("/:id", UserController.deleteUser)


export default userRouter
