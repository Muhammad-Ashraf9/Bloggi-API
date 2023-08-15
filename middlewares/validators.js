const { body } = require("express-validator");

exports.postValidator = () => [
  body("title")
    .trim()
    .isLength({ min: 5 })
    .withMessage("title length should be 5 "),
  body("author")
    .trim()
    .isLength({ min: 5 })
    .withMessage("author length should be 5 "),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("content length should be 5 "),
];
