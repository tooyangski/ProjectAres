const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const { signup, login } = require("../controllers/user-controller");

router.post(
  "/signup",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name must not be empty.")
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage("Name must not be less than 5 characters.")
      .matches(/^[a-z ,.'-]+$/i)
      .withMessage("Name must be alphabet only."),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Email address is required & it must be valid."),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password must not be empty.")
      .trim()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must not be less than 6 characters.")
      .matches(/\d/)
      .withMessage("Password must contain a number."),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Email address is required & it must be valid."),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password must not be empty.")
      .trim()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must not be less than 6 characters.")
      .matches(/\d/)
      .withMessage("Password must contain a number."),
  ],
  login
);

module.exports = router;
