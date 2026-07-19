/**
 * Authentication Placeholder Middleware
 * Simulates user extraction from JWT token headers
 */
module.exports = (req, res, next) => {
  // Simulate token extraction and validation
  req.user = {
    id: "user-dummy-id-12345",
    name: "Prakash Raj",
    email: "user@example.com",
    role: "user"
  };
  
  console.log(`[Auth Middleware] Authenticated request for user: ${req.user.email}`);
  next();
};
