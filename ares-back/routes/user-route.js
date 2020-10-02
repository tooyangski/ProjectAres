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
      .trim()
      .isLength({ min: 5, max: 50 })
      .withMessage("Name is required & must not be less than 5 characters.")
      .matches(/^[a-z ,.'-]+$/i)
      .withMessage("Name must be alphabet only."),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Email address is required & it must be valid."),
    check("password")
      .not()
      .isEmpty()
      .trim()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password is required & must not be less than 6 characters.")
      .matches(/\d/)
      .withMessage("Password must contain a a number."),
  ],
  signup
);

router.post("/login", login);

module.exports = router;