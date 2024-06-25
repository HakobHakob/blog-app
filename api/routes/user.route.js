import express from "express"
import { deleteUser, signOut, updateUser } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
const router = express.Router()

/*Update user  */
router.put("/update/:userId", verifyToken, updateUser)

/*Delete user */
router.delete("/delete/:userId",verifyToken,deleteUser )

/*Sign out route */
router.post("/signuot", signOut)

export default router
