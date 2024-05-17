import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import cors from "cors"
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser"
import logger from "morgan"

const __filename = fileURLToPath(import.meta.url) // Get current file path
const __dirname = path.dirname(__filename) // Derive directory path

import homeRouter from "./routes/index.js"
import userRoutes from "./routes/user.route.js"


const app = express()
// Handle requests for favicon.ico
app.get("/favicon.ico", (req, res) => res.status(204))
dotenv.config()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// Set CORS options
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8800",
]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  //   origin:"*",
  credentials: true, // Allow sending cookies from client to server
}
app.use(cors(corsOptions))

//Fileupload
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    // useTempFiles : true,
    // tempFileDir : __dirname + '/tmp',
    // safeFileNames: true,
    // preserveExtension: true,
  })
)

app.use(express.static(path.join(__dirname, "public")))

app.use("/api_v1/", homeRouter)
app.use("/api_v1/user/", userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong!"
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})
export default app
