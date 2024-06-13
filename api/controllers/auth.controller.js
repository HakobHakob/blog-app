import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import {
  errorHandler,
  generateRandomPassword,
  getRandomName,
} from "../utils/error.js"

/*Create or sign up user */
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

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body

  try {
    const user = await User.findOne({ email })
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      const { password, ...userOtherDetails } = user._doc
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(userOtherDetails)
    } else {
      const randomPass = generateRandomPassword()
      const hashedPassword = bcryptjs.hashSync(randomPass, 10)
      const newUser = new User({
        //John Travolta => johntravolta1234
        username: name.toLowerCase().split(" ").join("") + getRandomName(),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      })
      await newUser.save()
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
      const { password, ...userOtherDetails } = newUser._doc
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(userOtherDetails)
    }
  } catch (error) {
    next(error)
  }
}
