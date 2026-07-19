import { randomBytes } from "crypto";

class ShippingService {
  /**
   * Look up shipping charges and rates
   */
  async lookupRates(zipCode, totalWeightKg) {
    // Abstract lookup: lower rates for local zones, higher for others
    const isLocal = zipCode.startsWith("500") || zipCode.startsWith("600");
    const rate = isLocal ? 40 + totalWeightKg * 10 : 80 + totalWeightKg * 20;

    return {
      provider: "Shiprocket Simulation",
      rate: Number(rate.toFixed(2)),
      estimatedDays: isLocal ? 2 : 5,
    };
  }

  /**
   * Create shipment registration with courier
   */
  async createShipment({ orderId, shippingAddress, items }) {
    const trackingNumber = `SR-${randomBytes(6).toString("hex").toUpperCase()}`;

    return {
      shipmentId: `ship_${randomBytes(8).toString("hex")}`,
      trackingNumber,
      carrier: "Delhivery (via Shiprocket)",
      status: "AWB Assigned",
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days out
    };
  }

  /**
   * Track Shipment
   */
  async trackShipment(trackingNumber) {
    return {
      trackingNumber,
      carrier: "Delhivery (via Shiprocket)",
      status: "In Transit",
      timeline: [
        { status: "Manifested", title: "Shipment Manifested", description: "Courier picked up parcel", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { status: "In Transit", title: "In Transit", description: "Arrived at sorting facility", timestamp: new Date() },
      ],
    };
  }

  /**
   * Cancel shipment
   */
  async cancelShipment(trackingNumber) {
    return {
      success: true,
      message: `Shipment associated with AWB ${trackingNumber} has been cancelled successfully.`,
    };
  }
}

export default new ShippingService();
