import express from "express"
import {
  deleteUser,
  getUsers,
  signOut,
  updateUser,
} from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
const router = express.Router()

/*Update user  */
router.put("/update/:userId", verifyToken, updateUser)

/*Delete user */
router.delete("/delete/:userId", verifyToken, deleteUser)

/*Sign out route */
router.post("/signout", signOut)

/*Get all users data */
router.get("/getusers", verifyToken, getUsers)

export default router
