const mongoose = require("mongoose");
const orderRepository = require("../repositories/orderRepository");
const checkoutService = require("../../checkout/services/checkoutService");
const cartService = require("../../cart/services/cartService");
const inventoryRepository = require("../../product/repositories/inventoryRepository");
const productRepository = require("../../product/repositories/productRepository");
const paymentService = require("../../payment/services/paymentService");
const notificationService = require("../../notification/services/notificationService").default;
const invoiceService = require("../../invoice/services/invoiceService");
const shippingService = require("../../shipping/services/shippingService").default;
const User = require("../../../models/User");

class OrderService {
  /**
   * Place a new order
   */
  async placeOrder(userId, { addressId, couponCode, paymentMethod = "Razorpay" }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Review and compute checkout pricing & check stock availability
      const checkoutDetails = await checkoutService.reviewCheckout(userId, { addressId, couponCode });
      const user = await User.findById(userId);

      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // 2. Adjust stocks in Inventory and Product models
      for (const item of checkoutDetails.items) {
        // Parse numerical weight
        let weightKg = 0.5;
        const wStr = item.selectedWeight || "";
        if (wStr.includes("kg")) weightKg = parseFloat(wStr);
        else if (wStr.includes("g")) weightKg = parseFloat(wStr) / 1000;

        // Perform stock reservation/deduction
        const inv = await inventoryRepository.findByProductId(item.product._id);
        if (!inv || inv.stock < item.quantity) {
          throw { status: 400, message: `Insufficient stock for product: ${item.product.name}` };
        }

        // Deduct stock from Inventory
        await inventoryRepository.update(item.product._id, { stock: inv.stock - item.quantity }, session);
        // Deduct stock from Product
        await productRepository.update(item.product._id, { stock: inv.stock - item.quantity }, session);

        // Record stock history transaction
        await inventoryRepository.createHistory({
          product: item.product._id,
          changeType: "OUTWARD",
          quantity: item.quantity,
          previousStock: inv.stock,
          newStock: inv.stock - item.quantity,
          referenceType: "ORDER",
          referenceId: orderId,
          remarks: `Order placement deduction`,
          performedBy: userId,
        }, session);
      }

      // 3. Construct Order Items array
      const orderItems = checkoutDetails.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
        weight: item.selectedWeight,
      }));

      // 4. Register Order
      const orderData = {
        orderId,
        user: userId,
        items: orderItems,
        shippingAddress: checkoutDetails.shippingAddress,
        subtotal: checkoutDetails.subtotal,
        discount: checkoutDetails.discount,
        shippingCharge: checkoutDetails.shippingCharge,
        tax: checkoutDetails.tax,
        total: checkoutDetails.total,
        couponApplied: checkoutDetails.couponApplied,
        paymentMethod,
        paymentStatus: "Pending",
        orderStatus: "Pending",
        trackingDetails: {
          status: "Pending Payment",
          timeline: [{ status: "Pending", title: "Order Placed", description: "Waiting for payment verification" }],
        },
      };

      const order = await orderRepository.create(orderData, session);

      // 5. If Razorpay, initialize Razorpay order
      let razorpayOrderDetails = null;
      if (paymentMethod === "Razorpay") {
        razorpayOrderDetails = await paymentService.createRazorpayOrder(order.total, orderId);
        order.razorpayOrderId = razorpayOrderDetails.id;
        await order.save({ session });
      }

      // 6. Clear shopping cart
      await cartService.clearCart(userId, session);

      await session.commitTransaction();
      session.endSession();

      // Non-blocking notification if COD
      if (paymentMethod === "COD") {
        order.paymentStatus = "Pending";
        order.orderStatus = "Processing";
        order.trackingDetails.status = "Confirmed";
        order.trackingDetails.timeline.push({ status: "Processing", title: "Order Confirmed", description: "COD Order approved for packaging" });
        await order.save();

        notificationService.sendOrderConfirmation(user, order);
      }

      return {
        order,
        razorpayOrderDetails,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Confirm Razorpay Payment Signature
   */
  async confirmPayment(userId, { orderId, razorpayPaymentId, razorpaySignature }) {
    const order = await orderRepository.findByOrderId(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    const isValid = paymentService.verifyPaymentSignature({
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      order.paymentStatus = "Failed";
      order.trackingDetails.timeline.push({ status: "Failed", title: "Payment Failed", description: "Signature verification failed" });
      await order.save();
      throw { status: 400, message: "Invalid payment signature verification failed" };
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Processing";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.trackingDetails.status = "Confirmed";
    order.trackingDetails.timeline.push({ status: "Processing", title: "Payment Confirmed", description: "Payment verified successfully" });

    // Generate Invoice PDF
    const user = await User.findById(userId);
    const invoicePdfPath = await invoiceService.generateInvoicePdf(order, user);
    order.invoicePath = invoicePdfPath;

    await order.save();

    // Trigger confirmation notification email
    notificationService.sendOrderConfirmation(user, order);

    return order;
  }

  /**
   * Update Order status (Admin only)
   */
  async updateStatus(orderId, status, trackingPayload = {}, performedBy) {
    const order = await orderRepository.findByOrderId(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    // Timeline milestone update
    order.trackingDetails.timeline.push({
      status,
      title: `Order status: ${status}`,
      description: trackingPayload.remarks || `Order transitioned to ${status}`,
    });

    if (status === "Shipped") {
      // Allocate AWB & register carrier shipment
      const shipment = await shippingService.createShipment({
        orderId: order.orderId,
        shippingAddress: order.shippingAddress,
        items: order.items,
      });

      order.trackingDetails.carrier = shipment.carrier;
      order.trackingDetails.trackingNumber = shipment.trackingNumber;
      order.trackingDetails.status = shipment.status;
      order.estimatedDeliveryDate = shipment.estimatedDelivery;
    }

    if (status === "Delivered") {
      if (order.paymentMethod === "COD") {
        order.paymentStatus = "Paid";
      }

      // Auto-generate invoice for COD if not already done
      if (!order.invoicePath) {
        const user = await User.findById(order.user);
        const invoicePdfPath = await invoiceService.generateInvoicePdf(order, user);
        order.invoicePath = invoicePdfPath;
      }
    }

    await order.save();

    // Send update notification email
    const user = await User.findById(order.user);
    notificationService.sendOrderStatusUpdate(user, order);

    return order;
  }

  /**
   * Cancel Order
   */
  async cancelOrder(orderId, reason, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await orderRepository.findByOrderId(orderId);
      if (!order) {
        throw { status: 404, message: "Order not found" };
      }

      // Check cancellable statuses
      if (!["Pending", "Processing"].includes(order.orderStatus)) {
        throw { status: 400, message: "Order is already shipped or delivered, cannot be cancelled" };
      }

      // Revert product inventories
      for (const item of order.items) {
        const inv = await inventoryRepository.findByProductId(item.product);
        if (inv) {
          await inventoryRepository.update(item.product, { stock: inv.stock + item.quantity }, session);
          await productRepository.update(item.product, { stock: inv.stock + item.quantity }, session);

          await inventoryRepository.createHistory({
            product: item.product,
            changeType: "INWARD",
            quantity: item.quantity,
            previousStock: inv.stock,
            newStock: inv.stock + item.quantity,
            referenceType: "RETURN",
            remarks: `Order #${orderId} cancellation restock`,
            performedBy: userId,
          }, session);
        }
      }

      order.orderStatus = "Cancelled";
      order.trackingDetails.timeline.push({
        status: "Cancelled",
        title: "Order Cancelled",
        description: reason || "Cancelled by customer request",
      });

      // Process refunds if order was paid
      if (order.paymentStatus === "Paid" && order.razorpayPaymentId) {
        const refund = await paymentService.initiateRefund({
          paymentId: order.razorpayPaymentId,
          amount: order.total,
          reason: `Cancellation: ${reason}`,
        });

        order.paymentStatus = "Refunded";
        order.refundDetails = {
          refundId: refund.refundId,
          amount: order.total,
          status: refund.status,
          reason,
          processedAt: new Date(),
        };
      }

      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      const user = await User.findById(order.user);
      notificationService.sendOrderStatusUpdate(user, order);

      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Request Product Return (Delivered within 7 days)
   */
  async requestReturn(orderId, reason, userId) {
    const order = await orderRepository.findByOrderId(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }

    if (order.orderStatus !== "Delivered") {
      throw { status: 400, message: "Returns can only be requested for delivered orders" };
    }

    // 7 day check
    const deliveryTime = new Date(order.updatedAt).getTime();
    const currentTime = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (currentTime - deliveryTime > sevenDaysMs) {
      throw { status: 400, message: "Return period has expired. Returns are only allowed within 7 days of delivery." };
    }

    order.orderStatus = "Return Requested";
    order.returnDetails = {
      reason,
      status: "Requested",
      requestedAt: new Date(),
    };
    order.trackingDetails.timeline.push({
      status: "Return Requested",
      title: "Return Requested",
      description: reason,
    });

    await order.save();
    return order;
  }

  /**
   * Approve/Reject return request (Admin only)
   */
  async processReturn(orderId, { action, remarks }, performedBy) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await orderRepository.findByOrderId(orderId);
      if (!order) {
        throw { status: 404, message: "Order not found" };
      }

      if (order.orderStatus !== "Return Requested") {
        throw { status: 400, message: "No active return request found for this order" };
      }

      if (action === "Approved") {
        order.orderStatus = "Returned";
        order.returnDetails.status = "Approved";
        order.returnDetails.processedAt = new Date();
        order.trackingDetails.timeline.push({
          status: "Returned",
          title: "Return Approved",
          description: remarks || "Goods received and return approved",
        });

        // Restock products
        for (const item of order.items) {
          const inv = await inventoryRepository.findByProductId(item.product);
          if (inv) {
            await inventoryRepository.update(item.product, { stock: inv.stock + item.quantity }, session);
            await productRepository.update(item.product, { stock: inv.stock + item.quantity }, session);

            await inventoryRepository.createHistory({
              product: item.product,
              changeType: "INWARD",
              quantity: item.quantity,
              previousStock: inv.stock,
              newStock: inv.stock + item.quantity,
              referenceType: "RETURN",
              remarks: `Order #${orderId} return restock`,
              performedBy: performedBy,
            }, session);
          }
        }

        // Process refund
        if (order.paymentStatus === "Paid" && order.razorpayPaymentId) {
          const refund = await paymentService.initiateRefund({
            paymentId: order.razorpayPaymentId,
            amount: order.total,
            reason: `Return Approved: ${remarks}`,
          });

          order.paymentStatus = "Refunded";
          order.refundDetails = {
            refundId: refund.refundId,
            amount: order.total,
            status: refund.status,
            reason: remarks,
            processedAt: new Date(),
          };
        }
      } else {
        // Return Rejected
        order.orderStatus = "Return Rejected";
        order.returnDetails.status = "Rejected";
        order.returnDetails.processedAt = new Date();
        order.trackingDetails.timeline.push({
          status: "Return Rejected",
          title: "Return Rejected",
          description: remarks || "Return request rejected by store management",
        });
      }

      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getOrderDetails(orderId) {
    const order = await orderRepository.findByOrderId(orderId);
    if (!order) {
      throw { status: 404, message: "Order not found" };
    }
    return order;
  }

  async getUserOrders(userId, query) {
    return orderRepository.findByUserId(userId, query);
  }

  async getAdminOrders(query) {
    return orderRepository.findAllAdmin(query);
  }
}

module.exports = new OrderService();
