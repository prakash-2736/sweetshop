const Product = require("../../../models/Product");

class ProductRepository {
  async findById(id, options = {}) {
    let query = Product.findById(id);
    if (options.populateCategory) {
      query = query.populate("category", "name slug description");
    }
    if (options.lean) {
      query = query.lean();
    }
    return query.exec();
  }

  async findOne(filter, options = {}) {
    let query = Product.findOne(filter);
    if (options.populateCategory) {
      query = query.populate("category", "name slug description");
    }
    if (options.lean) {
      query = query.lean();
    }
    return query.exec();
  }

  async create(data, session = null) {
    const product = new Product(data);
    return product.save({ session });
  }

  async update(id, updateData, session = null) {
    return Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, session }
    );
  }

  async softDelete(id, session = null) {
    return Product.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true, session }
    );
  }

  async findWithFilters({ search, category, minPrice, maxPrice, featured, bestSeller, availability, rating, status, sort, page = 1, limit = 10, lean = true }) {
    const query = { isDeleted: false };

    // 1. Text search
    if (search) {
      query.$text = { $search: search };
    }

    // 2. Filters
    if (category) {
      query.category = category;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }
    if (featured !== undefined) {
      // Assuming featured means it has some badge or high rating
      query.rating = { $gte: 4.5 };
    }
    if (bestSeller !== undefined) {
      query.badge = "Bestseller";
    }
    if (availability !== undefined) {
      if (availability === "in-stock") {
        query.stock = { $gt: 0 };
        query.status = "Published";
      } else if (availability === "out-of-stock") {
        query.$or = [{ stock: 0 }, { status: "Out Of Stock" }];
      }
    }
    if (rating !== undefined) {
      query.rating = { $gte: Number(rating) };
    }
    if (status) {
      query.status = status;
    } else {
      // By default, only show Published products to users unless admin requests specific status
      query.status = "Published";
    }

    // 3. Sorting
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case "price-asc":
          sortOptions.price = 1;
          break;
        case "price-desc":
          sortOptions.price = -1;
          break;
        case "rating":
          sortOptions.rating = -1;
          break;
        case "newest":
          sortOptions.createdAt = -1;
          break;
        case "oldest":
          sortOptions.createdAt = 1;
          break;
        case "bestSeller":
          sortOptions.badge = -1;
          sortOptions.rating = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1;
    }

    // Include text search score sorting if doing search without explicit sort
    if (search && !sort) {
      sortOptions = { score: { $meta: "textScore" } };
    }

    const skip = (page - 1) * limit;

    let dbQuery = Product.find(query);
    
    if (search) {
      dbQuery = dbQuery.select({ score: { $meta: "textScore" } });
    }

    dbQuery = dbQuery
      .populate("category", "name slug")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    if (lean) {
      dbQuery = dbQuery.lean();
    }

    const [products, total] = await Promise.all([
      dbQuery.exec(),
      Product.countDocuments(query),
    ]);

    return {
      products,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async countByCategory(categoryId) {
    return Product.countDocuments({ category: categoryId, isDeleted: false });
  }

  async bulkUpdate(filter, updateData, session = null) {
    return Product.updateMany(filter, { $set: updateData }, { session });
  }
}

module.exports = new ProductRepository();
