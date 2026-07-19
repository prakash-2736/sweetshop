const mediaService = require("../services/mediaService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class MediaController {
  async upload(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return ApiResponse.error(res, HTTP_STATUS.BAD_REQUEST, "No files uploaded");
      }

      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const images = await mediaService.uploadProductImages(
        req.params.productId,
        req.files,
        req.user.id,
        ipAddress
      );

      return ApiResponse.success(res, HTTP_STATUS.OK, "Images uploaded successfully", images);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const images = await mediaService.deleteProductImage(
        req.params.productId,
        req.params.imageId,
        req.user.id,
        ipAddress
      );

      return ApiResponse.success(res, HTTP_STATUS.OK, "Image deleted successfully", images);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MediaController();
