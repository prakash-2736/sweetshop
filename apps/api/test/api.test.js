const test = require("node:test");
const assert = require("node:assert");
const http = require("http");
const app = require("../src/app");
const mongoose = require("mongoose");
const config = require("../src/config");

let server;
let baseUrl;

test.before(async () => {
  // Connect to DB if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(config.MONGODB_URI);
  }

  // Start Express server on a dynamic/random port
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`🧪 Test server running on: ${baseUrl}`);
      resolve();
    });
  });
});

test.after(async () => {
  // Clean up server and db connections
  await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
  console.log("🧪 Test server and DB connection closed successfully.");
});

test("API Suite - GET /health returns status 200 and healthy payload", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.message, "System is healthy");
});

test("API Suite - GET /api/v1 returns version metadata", async () => {
  const res = await fetch(`${baseUrl}/api/v1`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.match(body.message, /SweetShop API/);
});

test("API Suite - POST /api/v1/auth/login with incorrect credentials returns 401", async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "invalid@example.com", password: "wrongpassword" }),
  });

  assert.strictEqual(res.status, 401);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});
