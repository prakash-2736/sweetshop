const categoryRepository = require("../repositories/categoryRepository");
const productRepository = require("../repositories/productRepository");
const auditLogRepository = require("../repositories/auditLogRepository");
const slugify = require("../utils/slugify");
const cache = require("../utils/cache");
const mongoose = require("mongoose");

class CategoryService {
  async createCategory(data, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const slug = slugify(data.name);

      // Verify unique slug
      const existing = await categoryRepository.findOne({ slug }, { lean: true });
      if (existing) {
        throw { status: 400, message: "Category with this name or slug already exists" };
      }

      const categoryData = {
        ...data,
        slug,
      };

      const category = await categoryRepository.create(categoryData, session);

      // Write Audit Log
      await auditLogRepository.create({
        action: "CATEGORY_CREATE",
        targetType: "CATEGORY",
        targetId: category._id,
        performedBy: userId,
        newState: category.toObject(),
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      // Clear cache
      await cache.flush();

      return category;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async updateCategory(id, data, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existingCategory = await categoryRepository.findById(id);
      if (!existingCategory || existingCategory.isDeleted) {
        throw { status: 404, message: "Category not found" };
      }

      const updatePayload = { ...data };
      if (data.name && data.name !== existingCategory.name) {
        const slug = slugify(data.name);
        const duplicate = await categoryRepository.findOne({ slug, _id: { $ne: id } });
        if (duplicate) {
          throw { status: 400, message: "Category with this name/slug already exists" };
        }
        updatePayload.slug = slug;
      }

      const previousState = existingCategory.toObject();
      const updatedCategory = await categoryRepository.update(id, updatePayload, session);

      // Audit log
      await auditLogRepository.create({
        action: "CATEGORY_UPDATE",
        targetType: "CATEGORY",
        targetId: updatedCategory._id,
        performedBy: userId,
        previousState,
        newState: updatedCategory.toObject(),
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      // Clear cache
      await cache.flush();

      return updatedCategory;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async deleteCategory(id, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const category = await categoryRepository.findById(id);
      if (!category || category.isDeleted) {
        throw { status: 404, message: "Category not found" };
      }

      // Check if products exist in this category
      const productCount = await productRepository.countByCategory(id);
      if (productCount > 0) {
        throw {
          status: 400,
          message: "Cannot delete category that still contains products. Please reassign or delete the products first.",
        };
      }

      const previousState = category.toObject();
      const deletedCategory = await categoryRepository.softDelete(id, session);

      // Audit log
      await auditLogRepository.create({
        action: "CATEGORY_DELETE",
        targetType: "CATEGORY",
        targetId: id,
        performedBy: userId,
        previousState,
        newState: deletedCategory.toObject(),
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      // Clear cache
      await cache.flush();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category || category.isDeleted) {
      throw { status: 404, message: "Category not found" };
    }
    return category;
  }

  async getCategoryBySlug(slug) {
    const category = await categoryRepository.findOne({ slug, isDeleted: false });
    if (!category) {
      throw { status: 404, message: "Category not found" };
    }
    return category;
  }

  async getAllCategories(queryParams = {}) {
    const cacheKey = cache.generateKey("categories", queryParams);
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const result = await categoryRepository.findAll(queryParams);
    await cache.set(cacheKey, result, 300); // cache for 5 minutes
    return result;
  }
}

module.exports = new CategoryService();
