const csv = require("csv-parser");
const fs = require("fs");
const productService = require("./productService");
const productRepository = require("../repositories/productRepository");
const categoryRepository = require("../repositories/categoryRepository");

class CsvService {
  /**
   * Export all products to CSV format
   */
  async exportProducts() {
    const { products } = await productRepository.findWithFilters({
      limit: 10000,
      status: "Published", // Export published products
    });

    const headers = [
      "ID",
      "Name",
      "Slug",
      "Category ID",
      "Category Name",
      "Description",
      "Price",
      "Discount Price",
      "Weight",
      "Stock",
      "Rating",
      "Sweet Type",
    ];

    const rows = products.map((p) => [
      p._id.toString(),
      `"${p.name.replace(/"/g, '""')}"`,
      p.slug,
      p.category?._id?.toString() || "",
      `"${(p.category?.name || "").replace(/"/g, '""')}"`,
      `"${(p.description || "").replace(/"/g, '""')}"`,
      p.price,
      p.discountPrice || 0,
      p.weight,
      p.stock,
      p.rating,
      p.sweetType,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return csvContent;
  }

  /**
   * Import products from uploaded CSV file
   */
  async importProducts(filePath, userId, ipAddress) {
    return new Promise((resolve, reject) => {
      const results = [];
      const report = {
        successCount: 0,
        failCount: 0,
        errors: [],
      };

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          // Process rows sequentially
          for (let index = 0; index < results.length; index++) {
            const row = results[index];
            const lineNumber = index + 2; // header is line 1

            try {
              // Basic Row validations
              if (!row.Name || !row.Description || !row.Price || !row.Weight || !row.SweetType || !row.CategoryName) {
                throw new Error("Missing required columns: Name, Description, Price, Weight, SweetType, and CategoryName must be populated.");
              }

              // Resolve or create category
              let category = await categoryRepository.findOne({
                name: { $regex: new RegExp(`^${row.CategoryName.trim()}$`, "i") },
                isDeleted: false,
              });

              if (!category) {
                // Auto-create category if missing
                category = await categoryRepository.create({
                  name: row.CategoryName.trim(),
                  slug: row.CategoryName.trim().toLowerCase().replace(/\s+/g, "-"),
                  description: `Auto-created during CSV import`,
                });
              }

              // Build product payload
              const productPayload = {
                name: row.Name.trim(),
                category: category._id,
                description: row.Description.trim(),
                price: parseFloat(row.Price),
                discountPrice: row.DiscountPrice ? parseFloat(row.DiscountPrice) : 0,
                weight: row.Weight.trim(),
                stock: row.Stock ? parseInt(row.Stock, 10) : 0,
                sweetType: row.SweetType.trim(),
                ingredients: row.Ingredients ? row.Ingredients.split(";").map((i) => i.trim()) : [],
              };

              // Check if product exists already (by name)
              const existingProduct = await productRepository.findOne({
                name: { $regex: new RegExp(`^${productPayload.name}$`, "i") },
              });

              if (existingProduct) {
                // Update
                await productService.updateProduct(existingProduct._id, productPayload, userId, ipAddress);
              } else {
                // Create new product
                await productService.createProduct(productPayload, userId, ipAddress);
              }

              report.successCount++;
            } catch (err) {
              report.failCount++;
              report.errors.push({
                line: lineNumber,
                rowName: row.Name || `Row ${index + 1}`,
                reason: err.message,
              });
            }
          }

          // Clean up uploaded CSV file
          fs.unlinkSync(filePath);
          resolve(report);
        })
        .on("error", (error) => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(error);
        });
    });
  }
}

module.exports = new CsvService();
