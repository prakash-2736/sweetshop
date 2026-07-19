const AuditLog = require("../../../models/AuditLog");

class AuditLogRepository {
  async create(data, session = null) {
    const log = new AuditLog(data);
    return log.save({ session });
  }

  async getLogs({ targetType, targetId, performedBy, action, page = 1, limit = 20 }) {
    const query = {};

    if (targetType) query.targetType = targetType;
    if (targetId) query.targetId = targetId;
    if (performedBy) query.performedBy = performedBy;
    if (action) query.action = action;

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate("performedBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .exec(),
      AuditLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = new AuditLogRepository();
