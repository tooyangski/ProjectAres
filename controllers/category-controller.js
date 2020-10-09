const createCategory = require("./category-controller/createCategory");
const updateCategory = require("./category-controller/updateCategory");
const deleteCategory = require("./category-controller/deleteCategory");

const {
  getCategories,
  getCategoryById,
} = require("./category-controller/getCategory");

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
