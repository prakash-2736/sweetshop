const morgan = require("morgan");
const { NODE_ENV } = require("../config");

// Select logging format based on environment
const format = NODE_ENV === "production" ? "combined" : "dev";

module.exports = morgan(format);
