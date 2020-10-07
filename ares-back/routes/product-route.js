const express = require("express");
const router = express.Router();

const fileUpload = require("../middlewares/file-upload");
const checkAuth = require("../middlewares/check-auth");
const checkIsAdmin = require("../middlewares/check-admin");

const { check } = require("express-validator");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product-controller");

//http://localhost:8000/api/product/
//http://localhost:8000/api/product/?page=1&limit=1&isActive=1
router.get("/", getProducts);

//http://localhost:8000/api/product/5f7c5cc2c96677114cec78ec
router.get("/:productId", getProductById);

router.use(checkAuth);
router.use(checkIsAdmin);

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
    check("price")
      .not()
      .isEmpty()
      .withMessage("Price must not be empty.")
      .trim()
      .isNumeric()
      .withMessage("Price must be a number."),
    check("category")
      .not()
      .isEmpty()
      .withMessage("Category must not be empty.")
      .trim()
      .isMongoId()
      .withMessage("Category must be an ID."),
    check("shipping")
      .not()
      .isEmpty()
      .withMessage("Shipping must not be empty.")
      .trim()
      .isBoolean()
      .withMessage("Shipping must be a boolean."),
  ],
  createProduct
);

router.patch(
  "/:productId",
  fileUpload.single("image"),
  [
    check("category")
      .not()
      .isEmpty()
      .withMessage("Category must not be empty.")
      .trim()
      .isMongoId()
      .withMessage("Category must be an ID."),
  ],
  updateProduct
);

router.delete("/:productId", deleteProduct);

module.exports = router;
