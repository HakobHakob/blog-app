import { PASSWORD_LENGTH } from "../utils/constants.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"

export const test = (req, res) => {
  res.json({ message: "This is a test function" })
}

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"))
  }

  let { username, password } = req.body
  if (password) {
    if (password.length < PASSWORD_LENGTH) {
      return next(errorHandler(400, "Password must be at least 6 characters"))
    }
    password = bcryptjs.hashSync(password, 10)
  }

  if (username) {
    if (username.length < 7 || username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      )
    }
    if (username.includes(" ")) {
      return next(errorHandler(400, "Username can't contain spaces"))
    }
    if (username !== username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"))
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      )
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    )
    const { password, ...otherDetails } = updatedUser._doc
    res.status(200).json(otherDetails)
  } catch (error) {
    next(error)
  }
}
