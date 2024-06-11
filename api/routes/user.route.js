import express from "express"
import { test, updateUser } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"
const router = express.Router()

/* GET users listing. */
router.get("/test", test)

/*Update user  */
router.put("/update/:userId", verifyToken, updateUser)

export default router
