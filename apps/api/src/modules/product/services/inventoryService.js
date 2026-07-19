const inventoryRepository = require("../repositories/inventoryRepository");
const productRepository = require("../repositories/productRepository");
const auditLogRepository = require("../repositories/auditLogRepository");
const mongoose = require("mongoose");

class InventoryService {
  async getProductInventory(productId) {
    const inventory = await inventoryRepository.findByProductId(productId, { populateProduct: true });
    if (!inventory) {
      throw { status: 404, message: "Inventory record not found for this product" };
    }
    return inventory;
  }

  async adjustStock(productId, quantity, remarks, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Get current inventory
      const inventory = await inventoryRepository.findByProductId(productId);
      if (!inventory) {
        throw { status: 404, message: "Inventory record not found" };
      }

      const previousStock = inventory.stock;
      const newStock = previousStock + Number(quantity);

      if (newStock < 0) {
        throw { status: 400, message: `Stock cannot fall below zero. Current stock: ${previousStock}, adjustment attempted: ${quantity}` };
      }

      // 2. Perform inventory update
      const updatedInventory = await inventoryRepository.update(productId, {
        stock: newStock,
        lastUpdatedBy: userId,
      }, session);

      // 3. Update the Product model's stock field
      const product = await productRepository.findById(productId);
      if (!product) {
        throw { status: 404, message: "Associated product not found" };
      }

      const productUpdatePayload = { stock: newStock };
      
      // Auto-update status to "Out Of Stock" if stock hits 0
      if (newStock === 0 && product.status === "Published") {
        productUpdatePayload.status = "Out Of Stock";
      } else if (newStock > 0 && product.status === "Out Of Stock") {
        productUpdatePayload.status = "Published";
      }

      await productRepository.update(productId, productUpdatePayload, session);

      // 4. Log Inventory History
      await inventoryRepository.createHistory({
        product: productId,
        changeType: quantity > 0 ? "INWARD" : "OUTWARD",
        quantity: Math.abs(quantity),
        previousStock,
        newStock,
        remarks: remarks || "Manual stock adjustment",
        performedBy: userId,
      }, session);

      // 5. Audit Log
      await auditLogRepository.create({
        action: "INVENTORY_ADJUST",
        targetType: "INVENTORY",
        targetId: updatedInventory._id,
        performedBy: userId,
        previousState: { stock: previousStock },
        newState: { stock: newStock, remarks },
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      return updatedInventory;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getInventoryHistory(productId, queryParams = {}) {
    return inventoryRepository.getHistory(productId, queryParams);
  }

  async getLowStockItems(queryParams = {}) {
    return inventoryRepository.findLowStock(queryParams);
  }
}

module.exports = new InventoryService();
