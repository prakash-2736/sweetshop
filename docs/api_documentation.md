# SweetShop API Documentation

This document describes the REST API endpoints available on the SweetShop E-commerce backend.

All endpoints are prefixed with `/api/v1` unless noted otherwise.

---

## Authentication & Profiles

### POST `/auth/register`
Creates a new customer account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "9876543210",
    "password": "securepassword123"
  }
  ```
- **Response**: `201 Created`

### POST `/auth/login`
Authenticates a user and sets HTTP-only cookies containing JWT tokens.
- **Request Body**:
  ```json
  {
    "email": "jane.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK`

### POST `/auth/logout`
Clears session refresh and access cookies.
- **Response**: `200 OK`

---

## Shopping Cart & Wishlist

### GET `/cart`
Retrieves the authenticated user's cart (performing automatic price and stock updates).
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

### POST `/cart`
Adds an item to the shopping cart.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "productId": "6a5cdf06fe3f85af508363c9",
    "quantity": 2,
    "selectedWeight": "500g"
  }
  ```
- **Response**: `200 OK`

### PUT `/cart/quantity`
Updates quantity of a specific product item inside the cart.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "productId": "6a5cdf06fe3f85af508363c9",
    "selectedWeight": "500g",
    "quantity": 4
  }
  ```
- **Response**: `200 OK`

### DELETE `/cart`
Removes an item from the cart.
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `productId=...&selectedWeight=...`
- **Response**: `200 OK`

---

## Coupons & Checkout

### POST `/coupons/validate`
Validates a coupon code against a transaction amount.
- **Request Body**:
  ```json
  {
    "code": "FESTIVE50",
    "amount": 1000
  }
  ```
- **Response**: `200 OK`

### POST `/checkout/review`
Computes transaction pricing breakdown (subtotal, taxes, shipping, coupon discount, final amount).
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "addressId": "6a5cdf06fe3f85af508363c8",
    "couponCode": "FESTIVE50"
  }
  ```
- **Response**: `200 OK`

---

## Orders & Processing

### POST `/orders`
Places an order. Initiates COD flow or registers a new Razorpay payment.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "addressId": "6a5cdf06fe3f85af508363c8",
    "couponCode": "FESTIVE50",
    "paymentMethod": "Razorpay"
  }
  ```
- **Response**: `201 Created`

### POST `/orders/confirm-payment`
Confirms a payment by verifying its Razorpay HMAC signature. Generates invoice on success.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "orderId": "ORD-12345678-999",
    "razorpayPaymentId": "pay_XYZ12345",
    "razorpaySignature": "computed_hmac_hex"
  }
  ```
- **Response**: `200 OK`

### GET `/orders/:orderId/invoice`
Downloads the PDF receipt for the order.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK (application/pdf binary)`

---

## Webhooks

### POST `/webhooks/razorpay`
Secured endpoint receiving Razorpay event notifications (e.g. `payment.captured`, `payment.failed`, `refund.processed`).
- **Headers**: `x-razorpay-signature: <computed_hmac>`
- **Response**: `200 OK`
