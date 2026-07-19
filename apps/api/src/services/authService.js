const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const tokenUtils = require("../utils/token");

class AuthService {
  /**
   * Register a new user
   */
  async register(data) {
    const { fullName, email, phone, password } = data;

    // Check duplicate email
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      console.warn(`[Auth Service Warning] Registration failed: Email ${email} is already in use.`);
      throw { status: 400, message: "Email is already in use" };
    }

    // Check duplicate phone
    const existingPhone = await userRepository.findByPhone(phone);
    if (existingPhone) {
      console.warn(`[Auth Service Warning] Registration failed: Phone ${phone} is already in use.`);
      throw { status: 400, message: "Phone number is already in use" };
    }

    // Hash password with 12 rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userRepository.create({
      name: fullName,
      email,
      phone,
      password: hashedPassword,
    });

    console.log(`[Auth Service Success] Registered new customer: ${email} (${newUser._id})`);

    // Remove password before returning
    const userPayload = newUser.toObject();
    delete userPayload.password;

    return userPayload;
  }

  /**
   * Authenticate user with credentials
   */
  async login(email, password) {
    const user = await userRepository.findWithPassword(email);
    if (!user) {
      console.warn(`[Auth Service Warning] Login failed: User not found for email ${email}.`);
      throw { status: 401, message: "Invalid email or password" };
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn(`[Auth Service Warning] Login failed: Invalid password entered for ${email}.`);
      throw { status: 401, message: "Invalid email or password" };
    }

    // Generate tokens
    const accessToken = tokenUtils.generateAccessToken(user);
    const refreshToken = tokenUtils.generateRefreshToken(user);

    // Save refresh token to DB
    await userRepository.updateRefreshToken(user._id, refreshToken);

    console.log(`[Auth Service Success] Login success for customer: ${email}`);

    const userPayload = user.toObject();
    delete userPayload.password;
    delete userPayload.refreshToken;

    return {
      user: userPayload,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout user and invalidate refresh token
   */
  async logout(userId) {
    await userRepository.updateRefreshToken(userId, null);
    console.log(`[Auth Service Success] Logout success for customer: ${userId}`);
    return true;
  }

  /**
   * Refresh access token using active refresh token
   */
  async refreshSession(refreshToken) {
    try {
      const decoded = tokenUtils.verifyToken(refreshToken);
      const user = await userRepository.findById(decoded.id);
      
      if (!user) {
        throw { status: 401, message: "Invalid session" };
      }

      // Generate new access token
      const accessToken = tokenUtils.generateAccessToken(user);
      
      console.log(`[Auth Service Success] Session token refreshed for customer: ${user.email}`);
      return { accessToken };
    } catch (err) {
      console.warn(`[Auth Service Warning] Refresh token signature check failed: ${err.message}`);
      throw { status: 401, message: "Invalid or expired session token" };
    }
  }

  /**
   * Update profile details
   */
  async updateProfile(userId, updateData) {
    const updatedUser = await userRepository.update(userId, {
      name: updateData.fullName,
      phone: updateData.phone,
    });
    
    console.log(`[Auth Service Success] Profile updated for customer: ${updatedUser.email}`);
    return updatedUser;
  }

  /**
   * Update user password
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Get user with password
    const user = await userRepository.findById(userId).select("+password");
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    // Check current password
    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      console.warn(`[Auth Service Warning] Password change failed: Incorrect current password for ${user.email}.`);
      throw { status: 400, message: "Incorrect current password" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    console.log(`[Auth Service Success] Password changed successfully for customer: ${user.email}`);
    return true;
  }
}

module.exports = new AuthService();
