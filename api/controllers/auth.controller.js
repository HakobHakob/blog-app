import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
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
    res.json('Signup successful');
  } catch (error) {
    next(error)
  }
}
