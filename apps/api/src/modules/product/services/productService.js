const productRepository = require("../repositories/productRepository");
const categoryRepository = require("../repositories/categoryRepository");
const inventoryRepository = require("../repositories/inventoryRepository");
const auditLogRepository = require("../repositories/auditLogRepository");
const slugify = require("../utils/slugify");
const cache = require("../utils/cache").default;
const mongoose = require("mongoose");

class ProductService {
  async createProduct(data, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Verify Category exists and is not deleted
      const category = await categoryRepository.findById(data.category);
      if (!category || category.isDeleted) {
        throw { status: 404, message: "Category not found or deleted" };
      }

      // 2. Generate slug
      const slug = slugify(data.name);
      const existing = await productRepository.findOne({ slug }, { lean: true });
      if (existing) {
        throw { status: 400, message: "Product with this name or slug already exists" };
      }

      // 3. Create Product
      const productPayload = {
        ...data,
        slug,
      };

      const product = await productRepository.create(productPayload, session);

      // 4. Create Inventory record
      await inventoryRepository.create({
        product: product._id,
        stock: data.stock || 0,
        lowStockThreshold: data.lowStockThreshold || 10,
        location: data.warehouseLocation || "Main Warehouse",
        lastUpdatedBy: userId,
      }, session);

      // 5. Create Inventory History entry
      await inventoryRepository.createHistory({
        product: product._id,
        changeType: "INWARD",
        quantity: data.stock || 0,
        previousStock: 0,
        newStock: data.stock || 0,
        referenceType: "MANUAL_ADJUSTMENT",
        remarks: "Initial stock load on product creation",
        performedBy: userId,
      }, session);

      // 6. Audit log
      await auditLogRepository.create({
        action: "PRODUCT_CREATE",
        targetType: "PRODUCT",
        targetId: product._id,
        performedBy: userId,
        newState: product.toObject(),
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      // Clear cache
      await cache.flush();

      return product;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async updateProduct(id, data, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = await productRepository.findById(id);
      if (!product || product.isDeleted) {
        throw { status: 404, message: "Product not found" };
      }

      const updatePayload = { ...data };

      // Validate category if updating
      if (data.category && data.category.toString() !== product.category.toString()) {
        const category = await categoryRepository.findById(data.category);
        if (!category || category.isDeleted) {
          throw { status: 404, message: "Category not found or deleted" };
        }
      }

      // Generate slug if name changes
      if (data.name && data.name !== product.name) {
        const slug = slugify(data.name);
        const duplicate = await productRepository.findOne({ slug, _id: { $ne: id } });
        if (duplicate) {
          throw { status: 400, message: "Product with this name/slug already exists" };
        }
        updatePayload.slug = slug;
      }

      const previousState = product.toObject();
      const updatedProduct = await productRepository.update(id, updatePayload, session);

      // Audit log
      await auditLogRepository.create({
        action: "PRODUCT_UPDATE",
        targetType: "PRODUCT",
        targetId: updatedProduct._id,
        performedBy: userId,
        previousState,
        newState: updatedProduct.toObject(),
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      // Clear cache
      await cache.flush();

      return updatedProduct;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async deleteProduct(id, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = await productRepository.findById(id);
      if (!product || product.isDeleted) {
        throw { status: 404, message: "Product not found" };
      }

      const previousState = product.toObject();

      // Update status to Archived and soft delete
      const deletedProduct = await productRepository.update(id, {
        isDeleted: true,
        deletedAt: new Date(),
        status: "Archived",
      }, session);

      // Set stock to 0 in inventory
      await inventoryRepository.update(id, { stock: 0 }, session);

      // Audit log
      await auditLogRepository.create({
        action: "PRODUCT_DELETE",
        targetType: "PRODUCT",
        targetId: id,
        performedBy: userId,
        previousState,
        newState: deletedProduct.toObject(),
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

  async getProductById(id) {
    const product = await productRepository.findById(id, { populateCategory: true });
    if (!product || product.isDeleted) {
      throw { status: 404, message: "Product not found" };
    }
    return product;
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findOne({ slug, isDeleted: false }, { populateCategory: true });
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }
    return product;
  }

  async getAllProducts(queryParams = {}) {
    const cacheKey = cache.generateKey("products", queryParams);
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const result = await productRepository.findWithFilters(queryParams);
    await cache.set(cacheKey, result, 120); // cache for 2 minutes
    return result;
  }

  async updateProductStatus(id, status, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = await productRepository.findById(id);
      if (!product || product.isDeleted) {
        throw { status: 404, message: "Product not found" };
      }

      const previousState = product.toObject();
      const updatedProduct = await productRepository.update(id, { status }, session);

      await auditLogRepository.create({
        action: "PRODUCT_STATUS_TRANSITION",
        targetType: "PRODUCT",
        targetId: id,
        performedBy: userId,
        previousState,
        newState: updatedProduct.toObject(),
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      await cache.flush();
      return updatedProduct;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

module.exports = new ProductService();
