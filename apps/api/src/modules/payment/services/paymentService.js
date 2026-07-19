const Razorpay = require("razorpay");
const crypto = require("crypto");
const config = require("../../../config");

// Initialize Razorpay only if valid credentials are present
const isRazorpayConfigured =
  config.RAZORPAY.KEY_ID &&
  config.RAZORPAY.SECRET &&
  !config.RAZORPAY.KEY_ID.startsWith("your");

let razorpayInstance = null;
if (isRazorpayConfigured) {
  razorpayInstance = new Razorpay({
    key_id: config.RAZORPAY.KEY_ID,
    key_secret: config.RAZORPAY.SECRET,
  });
  console.log("💳 Razorpay credentials successfully initialized.");
} else {
  console.warn("⚠️ Razorpay credentials missing or default. Running payment service in Sandbox/Simulation mode.");
}

class PaymentService {
  /**
   * Create Razorpay Order
   * @param {number} amount - Amount in INR (e.g. ₹500.50)
   * @param {string} receiptId - Unique order reference
   */
  async createRazorpayOrder(amount, receiptId) {
    const amountInPaisa = Math.round(amount * 100);

    if (isRazorpayConfigured) {
      try {
        const order = await razorpayInstance.orders.create({
          amount: amountInPaisa,
          currency: "INR",
          receipt: receiptId,
        });
        return order;
      } catch (err) {
        throw { status: 500, message: `Razorpay Order Creation Failed: ${err.message}` };
      }
    } else {
      // Return simulated Razorpay order payload
      return {
        id: `rzp_mock_${crypto.randomBytes(8).toString("hex")}`,
        entity: "order",
        amount: amountInPaisa,
        amount_paid: 0,
        amount_due: amountInPaisa,
        currency: "INR",
        receipt: receiptId,
        status: "created",
        attempts: 0,
        notes: [],
        created_at: Math.floor(Date.now() / 1000),
      };
    }
  }

  /**
   * Verify Razorpay Payment Signature
   */
  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return false;
    }

    if (razorpayOrderId.startsWith("rzp_mock_")) {
      // Mock verification for local sandbox mode
      return true;
    }

    if (!isRazorpayConfigured) {
      return false;
    }

    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", config.RAZORPAY.SECRET)
      .update(text)
      .digest("hex");


    return generatedSignature === razorpaySignature;
  }

  /**
   * Refund a captured payment
   */
  async initiateRefund({ paymentId, amount, reason = "Customer request" }) {
    if (isRazorpayConfigured && !paymentId.startsWith("rzp_mock_")) {
      try {
        const refund = await razorpayInstance.payments.refund(paymentId, {
          amount: Math.round(amount * 100),
          notes: { reason },
        });
        return {
          refundId: refund.id,
          status: refund.status,
          amount,
        };
      } catch (err) {
        throw { status: 500, message: `Razorpay Refund Failed: ${err.message}` };
      }
    } else {
      // Return simulated refund result
      return {
        refundId: `rfnd_mock_${crypto.randomBytes(8).toString("hex")}`,
        status: "processed",
        amount,
      };
    }
  }
}

module.exports = new PaymentService();
