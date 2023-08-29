const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

require("dotenv").config();

const getJWT = function (data) {
  try {
    return jwt.sign(data, process.env.TOKEN_SECRET, {
      expiresIn: "1hr",
    });
  } catch (error) {
    throw error;
  }
};
const verifyJWT = function (token) {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    throw error;
  }
};
exports.postSignup = async (req, res, next) => {
  const validatedResultOfRequest = validationResult(req);

  const { email, password } = req.body;
  try {
    if (!validatedResultOfRequest.isEmpty())
      return res.status(403).json({ errors: validatedResultOfRequest.array() });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    if (!savedUser) throw new Error("couldn't signup, try again later.");
    return res.status(201).json({
      savedUser,
    });
  } catch (error) {
    next(error);
  }
};
exports.postSignin = async (req, res, next) => {
  const validatedResultOfRequest = validationResult(req);

  const { email, password } = req.body;
  try {
    if (!validatedResultOfRequest.isEmpty())
      return res.status(403).json({ errors: validatedResultOfRequest.array() });
    const user = await User.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw Error("Wrong Password.");

    const token = getJWT({ email: user.email, id: user._id });
    user.token = token;
    const savedUser = await user.save();
    res
      .status(200)
      .json({ message: "logged in successfully.", token: savedUser.token });
  } catch (error) {
    next(error);
  }
};
exports.isAuth = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    if (!token) throw Error("No Token found.");
    const decodedToken = verifyJWT(token);
    console.log("decodedToken :>> ", decodedToken);
    const { email } = decodedToken;
    const user = await User.findOne({ email: email });
    if (!user) throw Error("Invalid Token");
    req.user = user;
    next();
  } catch (error) {
    error.statusCode = 403;
    next(error);
  }
};
