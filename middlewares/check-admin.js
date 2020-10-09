const HttpError = require("../models/common/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (req.userData.role != 1) {
      throw new Error();
    }
    next();
  } catch (err) {
    const error = new HttpError(
      "Authorization failed, Admin access only!",
      403
    );

    return next(error);
  }
};
