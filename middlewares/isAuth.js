const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = function (token) {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    throw error;
  }
};
exports.isAuth = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    if (!token) throw Error("No Token found.");
    const decodedToken = verifyJWT(token);
    console.log("decodedToken :>> ", decodedToken);
    const { id } = decodedToken;

    req.userId = id;
    next();
  } catch (error) {
    error.statusCode = 403;
    next(error);
  }
};
