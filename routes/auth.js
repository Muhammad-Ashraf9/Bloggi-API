const express = require("express");
const { postSignup, isAuth, postSignin } = require("../controllers/auth");
const bodyParser = require("body-parser");
const {
  signupValidator,
  signinValidator,
} = require("../middlewares/validators");
const router = express.Router();
const jsonParser = bodyParser.json();
router.post("/signup", jsonParser, signupValidator(), postSignup);
router.post("/signin", jsonParser, signinValidator(), postSignin);
module.exports = router;
