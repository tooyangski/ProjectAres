const Product = require("../../models/product");
const HttpError = require("../../models/common/http-error");

const controller = "PRODUCT";

const getProducts = async (req, res, next) => {
  const stackTrace = { controller, action: "GET" };

  let products;
  try {
    const all = req.query.all ? req.query.all : false;

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const isActive = req.query.isActive ? req.query.isActive : true;

    if (all) {
      products = await Product.find();
    } else {
      products = await Product.find({ isActive })
        .limit(limit)
        .skip((page - 1) * limit);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch products, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }
  res.json(products);
};

const getProductById = async (req, res, next) => {
  const stackTrace = { controller, action: "GET_BY_ID" };

  const productId = req.params.productId;
  let product;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch product, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }
  res.json(product);
};

const getProductsByCategoryId = async (req, res, next) => {
  const stackTrace = { controller, action: "GET_BY_CATEGORY_ID" };
  const categoryId = req.params.categoryId;

  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const isActive = req.query.isActive ? req.query.isActive : true;

  let products;

  try {
    products = await Product.find({ category: categoryId, isActive })
      .populate("category")
      .limit(limit)
      .skip((page - 1) * limit);
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch products, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }
  res.json(products);
};

exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getProductsByCategoryId = getProductsByCategoryId;
