const User = require("../models/User");

class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findByPhone(phone) {
    return User.findOne({ phone });
  }

  async findWithPassword(email) {
    // Force select password field which is hidden by default in schemas
    return User.findOne({ email: email.toLowerCase() }).select("+password");
  }

  async create(userData) {
    return User.create(userData);
  }

  async update(id, updatedData) {
    return User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
  }

  async updateRefreshToken(id, token) {
    return User.findByIdAndUpdate(id, { refreshToken: token }, { new: true });
  }
}

module.exports = new UserRepository();
