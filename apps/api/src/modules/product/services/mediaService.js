const cloudinary = require("cloudinary").v2;
const productRepository = require("../repositories/productRepository");
const auditLogRepository = require("../repositories/auditLogRepository");
const config = require("../../../config");
const fs = require("fs");
const mongoose = require("mongoose");

// Configure Cloudinary only if credentials exist
const isCloudinaryConfigured =
  config.CLOUDINARY.CLOUD_NAME &&
  config.CLOUDINARY.API_KEY &&
  config.CLOUDINARY.API_SECRET &&
  !config.CLOUDINARY.CLOUD_NAME.startsWith("your");

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET,
  });
  console.log("📡 Cloudinary configuration loaded successfully.");
} else {
  console.warn("⚠️ Cloudinary credentials missing or default. Falling back to local file simulation.");
}

class MediaService {
  /**
   * Upload multiple images for a product
   */
  async uploadProductImages(productId, files, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = await productRepository.findById(productId);
      if (!product || product.isDeleted) {
        throw { status: 404, message: "Product not found" };
      }

      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let result;

        if (isCloudinaryConfigured) {
          // Upload to Cloudinary with WebP optimization & quality check
          result = await cloudinary.uploader.upload(file.path, {
            folder: "sweetshop/products",
            format: "webp",
            transformation: [{ width: 800, height: 800, crop: "limit" }],
          });
          // Clean up temp file
          fs.unlinkSync(file.path);
        } else {
          // Simulation fallback
          result = {
            secure_url: `/uploads/mock_product_${productId}_${Date.now()}_${i}.webp`,
            public_id: `sweetshop/products/mock_id_${Date.now()}_${i}`,
          };
        }

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: product.images.length === 0 && i === 0, // Make primary if first image
        });
      }

      const previousState = product.toObject();
      const updatedProduct = await productRepository.update(
        productId,
        { $push: { images: { $each: uploadedImages } } },
        session
      );

      // Audit log
      await auditLogRepository.create({
        action: "MEDIA_UPLOAD",
        targetType: "MEDIA",
        targetId: productId,
        performedBy: userId,
        previousState,
        newState: updatedProduct.toObject(),
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      return updatedProduct.images;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      // Clean up files in case of error
      for (const file of files) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
      throw error;
    }
  }

  /**
   * Delete an image from a product
   */
  async deleteProductImage(productId, imageId, userId, ipAddress) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = await productRepository.findById(productId);
      if (!product || product.isDeleted) {
        throw { status: 404, message: "Product not found" };
      }

      const imageToDelete = product.images.id(imageId);
      if (!imageToDelete) {
        throw { status: 404, message: "Image not found on product" };
      }

      const publicId = imageToDelete.publicId;

      if (isCloudinaryConfigured && publicId && !publicId.startsWith("sweetshop/products/mock")) {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      }

      const previousState = product.toObject();
      
      // Remove image from array
      product.images.pull(imageId);

      // If we deleted the primary image, make the first remaining image primary
      if (imageToDelete.isPrimary && product.images.length > 0) {
        product.images[0].isPrimary = true;
      }

      const updatedProduct = await product.save({ session });

      // Audit log
      await auditLogRepository.create({
        action: "MEDIA_DELETE",
        targetType: "MEDIA",
        targetId: productId,
        performedBy: userId,
        previousState,
        newState: updatedProduct.toObject(),
        ipAddress,
      }, session);

      await session.commitTransaction();
      session.endSession();

      return updatedProduct.images;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

module.exports = new MediaService();
