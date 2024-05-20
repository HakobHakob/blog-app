import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/user.model.js"

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const newUser = new User({
      ...req.body,
      password: hash,
    })
    await newUser.save()
    return res.status(200).send("Signup success!")
  } catch (error) {
    next(error)
  }
}
