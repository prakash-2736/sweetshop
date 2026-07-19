const Order = require("../../../models/Order");

class OrderAnalyticsService {
  /**
   * Get Revenue statistics grouped by month
   */
  async getRevenueStats() {
    return Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$total" },
          subtotalSum: { $sum: "$subtotal" },
          taxSum: { $sum: "$tax" },
          shippingSum: { $sum: "$shippingCharge" },
          discountSum: { $sum: "$discount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: 1,
          subtotalSum: 1,
          taxSum: 1,
          shippingSum: 1,
          discountSum: 1,
          orderCount: 1,
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);
  }

  /**
   * Get top customers by spend
   */
  async getTopCustomers({ limit = 10 } = {}) {
    return Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$total" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          phone: "$userDetails.phone",
          orderCount: 1,
          totalSpent: { $round: ["$totalSpent", 2] },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: Number(limit) },
    ]);
  }

  /**
   * Overall order metrics
   */
  async getGeneralOrderMetrics() {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          totalValue: { $sum: "$total" },
        },
      },
    ]);

    const averageOrderValue = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          avgValue: { $avg: "$total" },
        },
      },
    ]);

    return {
      statusDistribution: stats,
      averagePaidOrderValue: averageOrderValue.length > 0 ? Number(averageOrderValue[0].avgValue.toFixed(2)) : 0,
    };
  }
}

module.exports = new OrderAnalyticsService();
