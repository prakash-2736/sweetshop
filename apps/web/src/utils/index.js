/**
 * Formats a numerical value as USD currency.
 * @param {number} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Formats a date string/object.
 * @param {Date | string} date 
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}
