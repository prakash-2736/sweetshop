const crypto = require("crypto");
const orderRepository = require("../../order/repositories/orderRepository");
const orderService = require("../../order/services/orderService");
const User = require("../../../models/User");

// Read Webhook Secret from environment
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "sweetshop_webhook_secret_key_12345";

class WebhookController {
  async handleRazorpay(req, res, next) {
    try {
      const signature = req.headers["x-razorpay-signature"];
      
      // Compute HMAC digest
      const bodyString = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(bodyString)
        .digest("hex");

      // Verify signature (allowing bypass in development simulation)
      const isSignatureValid = (signature === expectedSignature) || (process.env.NODE_ENV === "development");
      
      if (!isSignatureValid) {
        console.warn("⚠️ [Webhook Warning] Invalid signature detected in incoming webhook request.");
        return res.status(400).json({ status: "invalid_signature" });
      }

      const event = req.body.event;
      console.log(`📡 [Webhook Received] Event: ${event}`);

      // Extract entity details
      const payload = req.body.payload;
      
      if (!payload || !payload.payment) {
        return res.status(200).json({ status: "no_payment_payload" });
      }

      const paymentEntity = payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Find associated order
      const order = await orderRepository.findByOrderId(paymentEntity.receipt) || 
                    await orderRepository.updateByOrderId(razorpayOrderId, { razorpayPaymentId });

      if (!order) {
        console.warn(`⚠️ [Webhook Warning] No matching order found for receipt/order_id: ${paymentEntity.receipt || razorpayOrderId}`);
        return res.status(200).json({ status: "order_not_found" });
      }

      // Idempotency check: if payment status is already processed, return immediately
      if (order.paymentStatus === "Paid" && event === "payment.captured") {
        return res.status(200).json({ status: "already_processed" });
      }

      switch (event) {
        case "payment.captured":
          // Update order status to paid
          await orderService.confirmPayment(order.user, {
            orderId: order.orderId,
            razorpayPaymentId,
            razorpaySignature: signature || "webhook_verified",
          });
          console.log(`✅ [Webhook Success] Payment captured successfully for Order #${order.orderId}`);
          break;

        case "payment.failed":
          order.paymentStatus = "Failed";
          order.trackingDetails.timeline.push({
            status: "Failed",
            title: "Payment Failed",
            description: paymentEntity.error_description || "Webhook payment failure notification",
          });
          await order.save();
          console.log(`❌ [Webhook Error] Payment failed for Order #${order.orderId}`);
          break;

        case "refund.processed":
          order.paymentStatus = "Refunded";
          order.orderStatus = "Refunded";
          order.trackingDetails.timeline.push({
            status: "Refunded",
            title: "Refund Processed",
            description: "Refund completed via Razorpay webhook",
          });
          await order.save();
          console.log(`🔄 [Webhook Success] Refund processed for Order #${order.orderId}`);
          break;

        default:
          console.log(`ℹ️ [Webhook Info] Unhandled event type: ${event}`);
      }

      return res.status(200).json({ status: "ok" });
    } catch (err) {
      console.error("🔥 [Webhook Error] Exception during processing:", err);
      // Always return 200/OK to webhook provider to prevent retry flood, but log errors internally
      return res.status(200).json({ status: "processed_with_internal_error" });
    }
  }
}

module.exports = new WebhookController();
