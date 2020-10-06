const express = require("express");
const router = express.Router();

const fileUpload = require("../middlewares/file-upload");
const checkAuth = require("../middlewares/check-auth");
const { check } = require("express-validator");

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
} = require("../controllers/category-controller");

//http://localhost:8000/api/category/
//http://localhost:8000/api/category/?page=1&limit=1
router.get("/", getAllCategories);

//http://localhost:8000/api/category/5f7c5cc2c96677114cec78ec
router.get("/:categoryId", getCategoryById);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name must not be empty.")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must not be less than 3 characters."),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Description must not be empty.")
      .trim()
      .isLength({ min: 5, max: 250 })
      .withMessage("Description must not be less than 5 characters."),
  ],
  createCategory
);

router.patch(
  "/:categoryId",
  fileUpload.single("image"),
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name must not be empty.")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must not be less than 3 characters."),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Description must not be empty.")
      .trim()
      .isLength({ min: 5, max: 250 })
      .withMessage("Description must not be less than 5 characters."),
  ],
  updateCategory
);

module.exports = router;
