const createProduct = require("./product-controller/createProduct");
const updateProduct = require("./product-controller/updateProduct");
const deleteProduct = require("./product-controller/deleteProduct");

const {
  getProducts,
  getProductById,
  getProductsByCategoryId,
} = require("./product-controller/getProduct");

exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getProductsByCategoryId = getProductsByCategoryId;

exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
