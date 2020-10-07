const jwt = require("jsonwebtoken");

const HttpError = require("../models/common/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error();
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    req.userData = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    next();
  } catch (err) {
    const error = new HttpError("Authentication failed, Invalid token!", 401);
    return next(error);
  }
};
