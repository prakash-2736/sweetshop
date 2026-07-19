const Inventory = require("../../../models/Inventory");
const InventoryHistory = require("../../../models/InventoryHistory");

class InventoryRepository {
  async findByProductId(productId, options = {}) {
    let query = Inventory.findOne({ product: productId });
    if (options.populateProduct) {
      query = query.populate("product", "name slug price sku stock status");
    }
    if (options.lean) {
      query = query.lean();
    }
    return query.exec();
  }

  async create(data, session = null) {
    const inventory = new Inventory(data);
    return inventory.save({ session });
  }

  async update(productId, updateData, session = null) {
    return Inventory.findOneAndUpdate(
      { product: productId },
      { $set: updateData },
      { new: true, runValidators: true, upsert: true, session }
    );
  }

  async adjustStock(productId, quantity, session = null) {
    // Atomically increment stock
    return Inventory.findOneAndUpdate(
      { product: productId },
      { $inc: { stock: quantity } },
      { new: true, runValidators: true, session }
    );
  }

  async reserveStock(productId, quantity, session = null) {
    // Atomically check if stock is sufficient, then decrement stock and increment reserved
    const inventory = await Inventory.findOne({ product: productId }).session(session);
    if (!inventory || inventory.stock < quantity) {
      throw new Error(`Insufficient stock available to reserve for product: ${productId}`);
    }
    inventory.stock -= quantity;
    inventory.reservedStock += quantity;
    return inventory.save({ session });
  }

  async releaseReservedStock(productId, quantity, session = null) {
    // Atomically decrement reserved and increment stock (e.g. order cancelled)
    return Inventory.findOneAndUpdate(
      { product: productId, reservedStock: { $gte: quantity } },
      { $inc: { stock: quantity, reservedStock: -quantity } },
      { new: true, session }
    );
  }

  async commitReservedStock(productId, quantity, session = null) {
    // Atomically decrement reserved stock (e.g. order completed/shipped)
    return Inventory.findOneAndUpdate(
      { product: productId, reservedStock: { $gte: quantity } },
      { $inc: { reservedStock: -quantity } },
      { new: true, session }
    );
  }

  async createHistory(historyData, session = null) {
    const history = new InventoryHistory(historyData);
    return history.save({ session });
  }

  async getHistory(productId, { page = 1, limit = 10 } = {}) {
    const filter = {};
    if (productId) {
      filter.product = productId;
    }
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      InventoryHistory.find(filter)
        .populate("performedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      InventoryHistory.countDocuments(filter),
    ]);

    return {
      history,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findLowStock({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    
    // Find where stock <= lowStockThreshold
    const query = {
      $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    };

    const [items, total] = await Promise.all([
      Inventory.find(query)
        .populate("product", "name slug price images status")
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      Inventory.countDocuments(query)
    ]);

    return {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = new InventoryRepository();
