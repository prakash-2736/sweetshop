const productRepository = require("../repositories/productRepository");
const categoryRepository = require("../repositories/categoryRepository");
const inventoryRepository = require("../repositories/inventoryRepository");
const auditLogRepository = require("../repositories/auditLogRepository");
const mongoose = require("mongoose");
const cache = require("../utils/cache");

class BulkService {
  /**
   * Bulk publish/archive products
   */
  async bulkUpdateStatus(productIds, status, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await productRepository.bulkUpdate(
        { _id: { $in: productIds } },
        { status },
        session
      );

      // Audit Log
      await auditLogRepository.create({
        action: `BULK_STATUS_UPDATE_${status.toUpperCase()}`,
        targetType: "PRODUCT",
        targetId: productIds[0], // Reference first product
        performedBy: userId,
        newState: { productIds, status },
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();
      await cache.flush();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Bulk soft delete products
   */
  async bulkSoftDelete(productIds, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await productRepository.bulkUpdate(
        { _id: { $in: productIds } },
        { isDeleted: true, deletedAt: new Date(), status: "Archived" },
        session
      );

      // Set stock to 0 in inventory for all deleted products
      await mongoose.model("Inventory").updateMany(
        { product: { $in: productIds } },
        { $set: { stock: 0 } },
        { session }
      );

      // Audit Log
      await auditLogRepository.create({
        action: "BULK_DELETE",
        targetType: "PRODUCT",
        targetId: productIds[0],
        performedBy: userId,
        newState: { productIds },
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();
      await cache.flush();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Bulk update stock
   */
  async bulkUpdateStock(adjustments, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of adjustments) {
        const { productId, quantity, remarks } = item;
        const inventory = await inventoryRepository.findByProductId(productId);
        if (!inventory) continue;

        const previousStock = inventory.stock;
        const newStock = previousStock + Number(quantity);

        if (newStock < 0) {
          throw { status: 400, message: `Stock cannot fall below zero. Current stock: ${previousStock} for product ID: ${productId}` };
        }

        await inventoryRepository.update(productId, { stock: newStock, lastUpdatedBy: userId }, session);
        await productRepository.update(productId, { stock: newStock }, session);

        await inventoryRepository.createHistory({
          product: productId,
          changeType: quantity > 0 ? "INWARD" : "OUTWARD",
          quantity: Math.abs(quantity),
          previousStock,
          newStock,
          remarks: remarks || "Bulk stock adjustment",
          performedBy: userId,
        }, session);
      }

      await auditLogRepository.create({
        action: "BULK_STOCK_UPDATE",
        targetType: "INVENTORY",
        targetId: adjustments[0].productId,
        performedBy: userId,
        newState: { adjustments },
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();
      await cache.flush();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Bulk update prices
   */
  async bulkUpdatePrices(updates, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const update of updates) {
        const { productId, price, discountPrice } = update;
        const updatePayload = {};
        if (price !== undefined) updatePayload.price = price;
        if (discountPrice !== undefined) updatePayload.discountPrice = discountPrice;

        await productRepository.update(productId, updatePayload, session);
      }

      await auditLogRepository.create({
        action: "BULK_PRICE_UPDATE",
        targetType: "PRODUCT",
        targetId: updates[0].productId,
        performedBy: userId,
        newState: { updates },
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();
      await cache.flush();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Bulk category reassignments
   */
  async bulkReassignCategory(productIds, categoryId, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const category = await categoryRepository.findById(categoryId);
      if (!category || category.isDeleted) {
        throw { status: 404, message: "Target category not found or deleted" };
      }

      await productRepository.bulkUpdate(
        { _id: { $in: productIds } },
        { category: categoryId },
        session
      );

      await auditLogRepository.create({
        action: "BULK_CATEGORY_REASSIGN",
        targetType: "PRODUCT",
        targetId: productIds[0],
        performedBy: userId,
        newState: { productIds, categoryId },
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();
      await cache.flush();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Bulk discounts
   */
  async bulkApplyDiscounts(productIds, discountPercentage, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const products = await mongoose.model("Product").find({ _id: { $in: productIds } }).session(session);

      for (const product of products) {
        const discountAmount = (product.price * discountPercentage) / 100;
        const discountPrice = Math.max(0, product.price - discountAmount);
        
        product.discountPrice = discountPrice;
        await product.save({ session });
      }

      await auditLogRepository.create({
        action: "BULK_DISCOUNT_APPLY",
        targetType: "PRODUCT",
        targetId: productIds[0],
        performedBy: userId,
        newState: { productIds, discountPercentage },
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();
      await cache.flush();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

module.exports = new BulkService();
