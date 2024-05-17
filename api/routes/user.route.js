import express from "express"
import { test } from "../controllers/user.controller.js"
const router = express.Router()

/* GET users listing. */
router.get("/test", test)

export default router
