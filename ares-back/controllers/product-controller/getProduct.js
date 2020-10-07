const Product = require("../../models/product");
const HttpError = require("../../models/common/http-error");

const controller = "PRODUCT";

const getProducts = async (req, res, next) => {
  const stackTrace = { controller, action: "GET" };

  let products;
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const isActive = req.query.isActive ? req.query.isActive : true;

    products = await Product.find({ isActive })
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

exports.getProducts = getProducts;
exports.getProductById = getProductById;
