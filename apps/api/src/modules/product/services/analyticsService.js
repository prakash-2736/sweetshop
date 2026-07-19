const Product = require("../../../models/Product");
const Category = require("../../../models/Category");
const Inventory = require("../../../models/Inventory");

class AnalyticsService {
  /**
   * Get overall product and inventory statistics
   */
  async getStockSummary() {
    const stats = await Product.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          averagePrice: { $avg: "$price" },
        },
      },
    ]);

    const lowStockCount = await Inventory.countDocuments({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    });

    const outOfStockCount = await Product.countDocuments({
      isDeleted: false,
      status: "Out Of Stock",
    });

    return {
      statusDistribution: stats,
      lowStockAlerts: lowStockCount,
      outOfStock: outOfStockCount,
    };
  }

  /**
   * Get product count and valuation per category
   */
  async getCategoryMetrics() {
    return Product.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$category",
          productCount: { $sum: 1 },
          totalValuation: { $sum: { $multiply: ["$price", "$stock"] } },
          avgRating: { $avg: "$rating" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$categoryDetails.name",
          productCount: 1,
          totalValuation: 1,
          avgRating: { $round: ["$avgRating", 2] },
        },
      },
      { $sort: { productCount: -1 } },
    ]);
  }

  /**
   * Dashboard overall overview metrics
   */
  async getDashboardSummary() {
    const [totalProducts, totalCategories, stockSummary] = await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Category.countDocuments({ isDeleted: false }),
      this.getStockSummary(),
    ]);

    return {
      totalProducts,
      totalCategories,
      inventory: stockSummary,
    };
  }
}

module.exports = new AnalyticsService();
