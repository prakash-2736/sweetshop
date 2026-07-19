const Coupon = require("../../../models/Coupon");

class CouponRepository {
  async findByCode(code) {
    return Coupon.findOne({ code: code.toUpperCase() }).exec();
  }

  async findById(id) {
    return Coupon.findById(id).exec();
  }

  async create(data) {
    const coupon = new Coupon(data);
    return coupon.save();
  }

  async update(id, data) {
    return Coupon.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
  }

  async delete(id) {
    return Coupon.findByIdAndDelete(id).exec();
  }

  async findAll({ page = 1, limit = 20, activeOnly = false } = {}) {
    const filter = {};
    if (activeOnly) {
      filter.isActive = true;
      filter.expiryDate = { $gt: new Date() };
    }
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      Coupon.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      Coupon.countDocuments(filter),
    ]);

    return {
      coupons,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = new CouponRepository();
