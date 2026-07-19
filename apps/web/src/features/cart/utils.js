import { addDays, format } from "date-fns";

/**
 * Returns estimated delivery date string based on number of days from today
 * @param {number} days 
 * @returns {string} formatted date
 */
export function getEstimatedDeliveryDate(days) {
  if (!days) return "";
  try {
    const deliveryDate = addDays(new Date(), days);
    return format(deliveryDate, "eeee, MMM dd");
  } catch (error) {
    // fallback if date-fns is not ready or errors out
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  }
}

/**
 * Returns coupon explanation text
 * @param {string} code 
 * @returns {string} description
 */
export function getCouponDescription(code) {
  switch (code?.toUpperCase()) {
    case "WELCOME10":
      return "10% off on all sweets (First order)";
    case "SWEET20":
      return "20% off on all sweets";
    case "FESTIVE50":
      return "50% off on holiday hampers";
    default:
      return "";
  }
}
