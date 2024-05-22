import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"))
  }

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  const newUser = new User({
    ...req.body,
    password: hash,
  })
  try {
    await newUser.save()
    res.json("Signup successful")
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  const { email, password } = req.body
  console.log("object", req.body)

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"))
  }

  try {
    const validUser = await User.findOne({ email })
    if (!validUser) {
      return next(errorHandler(404, "User not found"))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password!"))
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
    //Spread and get only other details, because it mustn't show in front part
    const { password: pass, ...otherDetails } = validUser._doc

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(otherDetails)
  } catch (error) {
    next(error)
  }
}
