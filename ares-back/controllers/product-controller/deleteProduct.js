const Product = require("../../models/product");
const HttpError = require("../../models/common/http-error");

const { deleteFile } = require("../../helpers/gcs-helper");
const stackTrace = { controller: "PRODUCT", action: "DELETE" };

module.exports = deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  let existingProduct;

  try {
    existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      const error = new HttpError(
        "Product ID does not exists, please choose another instead.",
        422,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to delete product, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  try {
    await existingProduct.remove();
  } catch (err) {
    const error = new HttpError(
      "Failed to delete product, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  try {
    //DELETE THE IMAGE FROM THE CLOUD
    await deleteFile(existingProduct.image);
  } catch (err) {
    const error = new HttpError(
      "Product has been deleted, but the image wasn't. Please contact your system admin!",
      500,
      stackTrace
    );

    return next(error);
  }

  res.status(200).json({ success: "Product has been deleted." });
};
