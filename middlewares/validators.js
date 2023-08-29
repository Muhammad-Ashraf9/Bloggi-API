const { body } = require("express-validator");
const User = require("../models/user");

exports.postValidator = () => [
  body("title")
    .trim()
    .isLength({ min: 6 })
    .withMessage("title length should be 6 "),
  body("author")
    .trim()
    .isLength({ min: 6 })
    .withMessage("author length should be 6 "),
  body("content")
    .trim()
    .isLength({ min: 6 })
    .withMessage("content length should be 6 "),
];
exports.signupValidator = () => [
  body("email")
    .trim()
    .isEmail()
    .withMessage("wrong E-mail format.")
    .custom(async (email) => {
      const user = await User.findOne({ email: email });
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("author length should be 6 "),
];
exports.signinValidator = () => [
  body("email")
    .trim()
    .isEmail()
    .withMessage("wrong E-mail format.")
    .custom(async (email) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("E-mail Not Found, signup first");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("author length should be 6 "),
];
