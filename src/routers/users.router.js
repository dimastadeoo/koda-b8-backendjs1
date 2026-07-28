import {Router} from "express"
import * as UserController from "../controllers/users.controller.js"
import authMiddleware from "../middlewares/authMiddleware.js"
// import { fileFilterImg } from "../lib/filterImg.js"
// import { storagePictureUsers, limitImg } from "../lib/uploadPictureUsers.js"
import { uploadMiddleware } from "../middlewares/upload.js"

const userRouter = Router()

userRouter.use(authMiddleware)

userRouter.get("", UserController.getAll)
userRouter.get("/:id", UserController.getById)
userRouter.post("", UserController.createUser)
userRouter.patch("/:id/picture",uploadMiddleware.single('picture'), UserController.uploadPicture)
userRouter.patch("/:id", UserController.updateUser)
userRouter.delete("/:id", UserController.deleteUser)


export default userRouter
