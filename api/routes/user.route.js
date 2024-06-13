import express from "express"
import { updateUser } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
const router = express.Router()

/*Update user  */
router.put("/update/:userId", verifyToken, updateUser)

export default router
