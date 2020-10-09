const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const HttpError = require("../models/common/http-error");

const { validationResult } = require("express-validator");
const controller = "USER";

const signup = async (req, res, next) => {
  const stackTrace = { controller, action: "SIGNUP" };
  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400, stackTrace));
  }

  const { name, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new HttpError(
        "User exists already, please login instead.",
        422,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to create user, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Failed to create user, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    encrypted_password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Failed to create user, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Failed to create user, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
    token: token,
  });
};

const login = async (req, res, next) => {
  const stackTrace = { controller, action: "LOGIN" };
  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400, stackTrace));
  }

  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to login, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  try {
    let isValidPassword = false;

    isValidPassword = await bcrypt.compare(
      password,
      existingUser.encrypted_password
    );

    if (!isValidPassword) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to login, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Failed to login, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    token: token,
  });
};

exports.signup = signup;
exports.login = login;
