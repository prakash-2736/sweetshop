const Order = require("../../../models/Order");

class OrderRepository {
  async findById(id, session = null) {
    return Order.findById(id).session(session).exec();
  }

  async findByOrderId(orderId, session = null) {
    return Order.findOne({ orderId }).session(session).exec();
  }

  async create(data, session = null) {
    const order = new Order(data);
    return order.save({ session });
  }

  async update(id, updateData, session = null) {
    return Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, session }
    );
  }

  async updateByOrderId(orderId, updateData, session = null) {
    return Order.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true, runValidators: true, session }
    );
  }

  async findByUserId(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const query = { user: userId };

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllAdmin({ page = 1, limit = 10, status, search } = {}) {
    const query = {};
    if (status) {
      query.orderStatus = status;
    }
    if (search) {
      // Search by orderId or trackingNumber
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "trackingDetails.trackingNumber": { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = new OrderRepository();
