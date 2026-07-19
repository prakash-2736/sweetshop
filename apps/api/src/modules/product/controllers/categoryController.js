const categoryService = require("../services/categoryService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class CategoryController {
  async create(req, res, next) {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const category = await categoryService.createCategory(req.body, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.CREATED, "Category created successfully", category);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const category = await categoryService.updateCategory(req.params.id, req.body, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Category updated successfully", category);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      await categoryService.deleteCategory(req.params.id, req.user.id, ipAddress);
      return ApiResponse.success(res, HTTP_STATUS.OK, "Category deleted successfully");
    } catch (err) {
      next(err);
    }
  }

  async getByIdOrSlug(req, res, next) {
    try {
      const { identifier } = req.params;
      let category;
      
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        category = await categoryService.getCategoryById(identifier);
      } else {
        category = await categoryService.getCategoryBySlug(identifier);
      }

      return ApiResponse.success(res, HTTP_STATUS.OK, "Category fetched successfully", category);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      const result = await categoryService.getAllCategories({ page, limit, search });
      return ApiResponse.success(res, HTTP_STATUS.OK, "Categories fetched successfully", result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
