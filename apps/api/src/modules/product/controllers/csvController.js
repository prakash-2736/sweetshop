const csvService = require("../services/csvService");
const ApiResponse = require("../../../utils/response");
const { HTTP_STATUS } = require("../../../constants");

class CsvController {
  async exportCsv(req, res, next) {
    try {
      const csvContent = await csvService.exportProducts();
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=products_export_${Date.now()}.csv`);
      return res.status(HTTP_STATUS.OK).send(csvContent);
    } catch (err) {
      next(err);
    }
  }

  async importCsv(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, HTTP_STATUS.BAD_REQUEST, "Please upload a CSV file");
      }

      const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const report = await csvService.importProducts(req.file.path, req.user.id, ipAddress);

      return ApiResponse.success(res, HTTP_STATUS.OK, "CSV import completed", report);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CsvController();
