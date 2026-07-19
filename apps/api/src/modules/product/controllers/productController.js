const productService = require("../services/productService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class ProductController {
  async create(req, res, next) {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const product = await productService.createProduct(req.body, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.CREATED, "Product created successfully", product);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const product = await productService.updateProduct(req.params.id, req.body, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Product updated successfully", product);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await productService.deleteProduct(req.params.id, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Product deleted successfully");
    } catch (err) {
      next(err);
    }
  }

  async getByIdOrSlug(req, res, next) {
    try {
      const { identifier } = req.params;
      let product;
      
      // If it looks like a MongoDB ObjectId, fetch by ID, otherwise fetch by Slug
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        product = await productService.getProductById(identifier);
      } else {
        product = await productService.getProductBySlug(identifier);
      }

      return ApiResponse.success(res, HTTP_STATUS.OK, "Product fetched successfully", product);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        featured,
        bestSeller,
        availability,
        rating,
        status,
        sort,
        page,
        limit,
      } = req.query;

      const result = await productService.getAllProducts({
        search,
        category,
        minPrice,
        maxPrice,
        featured,
        bestSeller,
        availability,
        rating,
        status,
        sort,
        page,
        limit,
      });

      return ApiResponse.success(res, HTTP_STATUS.OK, "Products fetched successfully", result);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const { status } = req.body;
      const product = await productService.updateProductStatus(req.params.id, status, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Product status updated successfully", product);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
