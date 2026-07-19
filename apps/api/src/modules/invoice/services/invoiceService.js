const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class InvoiceService {
  /**
   * Generate PDF Invoice for an Order
   * @param {object} order - Mongoose Order Document
   * @param {object} user - User/Customer object
   * @returns {string} - Absolute path to the generated PDF
   */
  async generateInvoicePdf(order, user) {
    const invoicesDir = path.join(__dirname, "../../../../uploads/invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const fileName = `invoice_${order.orderId}.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // --- Header ---
      doc.fillColor("#1e293b").fontSize(20).text("SWEET SHOP", 50, 45);
      doc.fontSize(10).fillColor("#64748b").text("Traditional Sweets & Savories", 50, 68);
      doc.text("GSTIN: 36AAAAA1111A1Z1", 50, 80);

      // Invoice metadata (top-right)
      doc.fillColor("#1e293b").fontSize(12).text("INVOICE", 400, 45, { align: "right" });
      doc.fontSize(9).fillColor("#64748b");
      doc.text(`Invoice No: INV-${order.orderId}`, 400, 60, { align: "right" });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 72, { align: "right" });
      doc.text(`Payment: ${order.paymentMethod} (${order.paymentStatus})`, 400, 84, { align: "right" });

      doc.moveDown(2);
      doc.strokeColor("#cbd5e1").lineWidth(1).moveTo(50, 105).lineTo(550, 105).stroke();

      // --- Billing details ---
      doc.fontSize(10).fillColor("#1e293b");
      doc.text("Billed To:", 50, 120, { underline: true });
      doc.text(user.name, 50, 135);
      doc.text(user.email, 50, 147);
      doc.text(user.phone, 50, 159);

      // Shipping Address (middle-right)
      const addr = order.shippingAddress;
      doc.text("Shipping Address:", 300, 120, { underline: true });
      doc.text(`${addr.street}`, 300, 135);
      doc.text(`${addr.city}, ${addr.state} - ${addr.zipCode}`, 300, 147);
      doc.text("India", 300, 159);

      doc.moveDown(3);

      // --- Table Headers ---
      const tableTop = 200;
      doc.font("Helvetica-Bold").text("Product Description", 50, tableTop);
      doc.text("Weight", 280, tableTop, { width: 60, align: "center" });
      doc.text("Qty", 340, tableTop, { width: 40, align: "center" });
      doc.text("Unit Price", 380, tableTop, { width: 80, align: "right" });
      doc.text("Total", 470, tableTop, { width: 80, align: "right" });

      doc.strokeColor("#cbd5e1").lineWidth(1).moveTo(50, 215).lineTo(550, 215).stroke();

      // --- Table Rows ---
      doc.font("Helvetica");
      let rowPosition = 225;

      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        
        doc.text(item.name, 50, rowPosition);
        doc.text(item.weight, 280, rowPosition, { width: 60, align: "center" });
        doc.text(item.quantity.toString(), 340, rowPosition, { width: 40, align: "center" });
        doc.text(`₹${item.price.toFixed(2)}`, 380, rowPosition, { width: 80, align: "right" });
        doc.text(`₹${itemTotal.toFixed(2)}`, 470, rowPosition, { width: 80, align: "right" });

        rowPosition += 20;
      });

      doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(50, rowPosition).lineTo(550, rowPosition).stroke();
      rowPosition += 15;

      // --- Pricing Breakdown ---
      const labelX = 350;
      const valX = 470;

      doc.text("Subtotal:", labelX, rowPosition);
      doc.text(`₹${order.subtotal.toFixed(2)}`, valX, rowPosition, { align: "right" });
      rowPosition += 15;

      // GST tax (split CGST/SGST 2.5% each for representation)
      const halfTax = order.tax / 2;
      doc.text("CGST (2.5%):", labelX, rowPosition);
      doc.text(`₹${halfTax.toFixed(2)}`, valX, rowPosition, { align: "right" });
      rowPosition += 15;

      doc.text("SGST (2.5%):", labelX, rowPosition);
      doc.text(`₹${halfTax.toFixed(2)}`, valX, rowPosition, { align: "right" });
      rowPosition += 15;

      doc.text("Shipping Charge:", labelX, rowPosition);
      doc.text(`₹${order.shippingCharge.toFixed(2)}`, valX, rowPosition, { align: "right" });
      rowPosition += 15;

      if (order.discount > 0) {
        doc.fillColor("green").text("Coupon Discount:", labelX, rowPosition);
        doc.text(`-₹${order.discount.toFixed(2)}`, valX, rowPosition, { align: "right" });
        rowPosition += 15;
      }

      doc.fillColor("#1e293b").font("Helvetica-Bold");
      doc.text("Grand Total:", labelX, rowPosition);
      doc.text(`₹${order.total.toFixed(2)}`, valX, rowPosition, { align: "right" });

      // --- Footer ---
      doc.fontSize(8).fillColor("#94a3b8").text("Thank you for shopping with SweetShop! Delight in every bite.", 50, 700, { align: "center" });

      doc.end();

      writeStream.on("finish", () => {
        resolve(filePath);
      });

      writeStream.on("error", (error) => {
        reject(error);
      });
    });
  }
}

module.exports = new InvoiceService();
