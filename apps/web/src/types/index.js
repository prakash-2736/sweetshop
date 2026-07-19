/**
 * @typedef {Object} Product
 * @property {string} id - Unique identifier for the product
 * @property {string} name - Name of the sweet/pastry
 * @property {('macarons'|'chocolates'|'pastries'|'gifts')} category - Product category
 * @property {number} price - Numerical price in USD
 * @property {number} rating - Average star rating (e.g. 4.8)
 * @property {number} reviewsCount - Total count of reviews
 * @property {string} [badge] - Optional promo badge text (e.g., 'Best Seller')
 * @property {string} description - Short punchy marketing summary
 * @property {string} longDescription - In-depth sensory description
 * @property {string} ingredients - List of ingredients and allergens
 * @property {Object} nutrition - Nutritional breakdown
 * @property {string} nutrition.calories - Calories per serving
 * @property {string} nutrition.fat - Fat amount
 * @property {string} nutrition.sugar - Sugar amount
 * @property {string} nutrition.protein - Protein amount
 * @property {string} color - Tailwind gradient classes (e.g., 'from-pink-100 to-rose-200')
 * @property {string} textColor - Tailwind text colors (e.g., 'text-rose-800')
 */

/**
 * @typedef {Object} CartItem
 * @property {Product} product - Product details
 * @property {number} quantity - Quantity in basket
 */

/**
 * @typedef {Object} Order
 * @property {string} fullName - Customer full name
 * @property {string} email - Customer email address
 * @property {string} address - Shipping street address
 * @property {string} city - Shipping city
 * @property {string} zipCode - Shipping 5-digit ZIP code
 * @property {string} cardNumber - 16-digit card number
 * @property {string} cardExpiry - Expiry MM/YY
 * @property {string} cardCvc - 3-digit security code
 */
