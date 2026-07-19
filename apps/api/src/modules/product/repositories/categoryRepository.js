const Category = require("../../../models/Category");

class CategoryRepository {
  async findById(id, options = {}) {
    let query = Category.findById(id);
    if (options.lean) {
      query = query.lean();
    }
    return query.exec();
  }

  async findOne(filter, options = {}) {
    let query = Category.findOne(filter);
    if (options.lean) {
      query = query.lean();
    }
    return query.exec();
  }

  async create(data, session = null) {
    const category = new Category(data);
    return category.save({ session });
  }

  async update(id, updateData, session = null) {
    return Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, session }
    );
  }

  async softDelete(id, session = null) {
    return Category.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true, session }
    );
  }

  async findAll({ page, limit, search, lean = true }) {
    const query = { isDeleted: false };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let dbQuery = Category.find(query).sort({ name: 1 });

    if (page && limit) {
      const skip = (page - 1) * limit;
      dbQuery = dbQuery.skip(skip).limit(Number(limit));
    }

    if (lean) {
      dbQuery = dbQuery.lean();
    }

    const [categories, total] = await Promise.all([
      dbQuery.exec(),
      Category.countDocuments(query),
    ]);

    return {
      categories,
      total,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : total,
      totalPages: limit ? Math.ceil(total / limit) : 1,
    };
  }
}

module.exports = new CategoryRepository();
