/**
 * Bloom Luxury Florist - Tax Invoice & Official Receipt Generator
 */

export function generateInvoice(order) {
  if (!order) return;

  const invoiceWindow = window.open('', '_blank');
  if (!invoiceWindow) {
    alert('Please allow popups to download or view your invoice.');
    return;
  }

  const itemsList = Array.isArray(order.items)
    ? order.items
    : [{ name: order.product || 'Luxury Arrangement', quantity: 1, priceUSD: order.amountUSD || 450 }];

  const subtotal = order.amountUSD || 0;
  const deliveryFee = 0; // Complimentary White-Glove
  const gstTax = Math.round(subtotal * 0.18); // 18% Luxury GST
  const grandTotal = subtotal + gstTax;

  const formattedAddress = typeof order.address === 'object'
    ? `${order.address.flat || ''}, ${order.address.street || ''}, ${order.address.landmark ? order.address.landmark + ', ' : ''}${order.address.city || ''}, ${order.address.state || ''} - ${order.address.pinCode || ''}`
    : (order.location || 'Customer Address');

  const customerName = order.customerInfo?.fullName || order.client || 'Valued Client';
  const customerPhone = order.customerInfo?.mobileNumber || '+91 98765 43210';
  const customerEmail = order.customerInfo?.email || 'client@royal-luxury.com';

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Tax Invoice - ${order.id} | Bloom Luxury Florist</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Playfair Display', Georgia, serif; }
        body { background: #0f1715; color: #f4efe6; padding: 40px 20px; font-size: 14px; }
        .invoice-card { max-width: 800px; margin: 0 auto; background: #141f1c; border: 1px solid #d4af37; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 24px; margin-bottom: 24px; }
        .brand h1 { font-size: 28px; color: #d4af37; letter-spacing: 2px; text-transform: uppercase; }
        .brand p { color: #a3b8b0; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { font-size: 22px; color: #f4efe6; }
        .invoice-title p { color: #d4af37; font-size: 12px; margin-top: 4px; font-weight: bold; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; font-sans: system-ui; }
        .meta-box { background: rgba(0,0,0,0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(212,175,55,0.15); }
        .meta-box h3 { color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .meta-box p { color: #d1e0db; font-size: 13px; line-height: 1.5; font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        th { background: rgba(212,175,55,0.15); color: #d4af37; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #d4af37; }
        td { padding: 14px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e2ece8; font-family: sans-serif; }
        .totals { width: 300px; margin-left: auto; margin-bottom: 32px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed rgba(212,175,55,0.2); font-family: sans-serif; }
        .row.grand { border-bottom: 2px solid #d4af37; font-weight: bold; color: #d4af37; font-size: 16px; font-family: serif; padding-top: 12px; }
        .footer { text-align: center; border-top: 1px solid rgba(212,175,55,0.3); pt-6; padding-top: 24px; color: #889e96; font-size: 11px; }
        .actions { margin-top: 24px; text-align: center; display: flex; justify-content: center; gap: 16px; }
        .btn { background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%); color: #0b1411; border: none; padding: 12px 28px; font-weight: bold; border-radius: 30px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; }
        .btn-close { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
        @media print {
          body { background: #fff; color: #000; padding: 0; }
          .invoice-card { border: none; box-shadow: none; background: #fff; color: #000; width: 100%; max-width: 100%; padding: 20px; }
          .brand h1, .invoice-title p, .meta-box h3, th, .row.grand { color: #000 !important; }
          .meta-box { background: #f9f9f9; border: 1px solid #ddd; }
          td, p { color: #333 !important; }
          .actions { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <div class="brand">
            <h1>Bloom Luxury Florist</h1>
            <p>Haute Couture Floral Atelier & Fine Gifts</p>
            <p style="margin-top: 4px;">GSTIN: 07AAACB1234F1Z8</p>
          </div>
          <div class="invoice-title">
            <h2>OFFICIAL TAX INVOICE</h2>
            <p>ORDER ID: ${order.id}</p>
            <p style="color: #a3b8b0; font-weight: normal; font-size: 11px; margin-top: 4px;">Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-box">
            <h3>Billed & Shipped To</h3>
            <p><strong>${customerName}</strong></p>
            <p>${formattedAddress}</p>
            <p>Phone: ${customerPhone}</p>
            <p>Email: ${customerEmail}</p>
          </div>
          <div class="meta-box">
            <h3>Payment & Delivery Info</h3>
            <p><strong>Payment Method:</strong> ${order.paymentMethod || 'Credit Card'}</p>
            <p><strong>Transaction ID:</strong> ${order.paymentId || 'TXN-' + order.id}</p>
            <p><strong>Payment Status:</strong> <span style="color: #22c55e; font-weight: bold;">SUCCESS</span></p>
            <p><strong>VIP Time Window:</strong> ${order.timeSlot || 'VIP White-Glove Hand Delivery'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Variant</th>
              <th>Qty</th>
              <th style="text-align: right;">Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList.map(item => `
              <tr>
                <td><strong>${item.name || item}</strong></td>
                <td>${item.variant || 'Signature Luxury Edition'}</td>
                <td>${item.quantity || 1}</td>
                <td style="text-align: right;">₹${Math.round((item.priceUSD || 450) * 83 * (item.quantity || 1)).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="row">
            <span>Items Subtotal:</span>
            <span>₹${Math.round(subtotal * 83).toLocaleString('en-IN')}</span>
          </div>
          <div class="row">
            <span>White-Glove VIP Delivery:</span>
            <span style="color: #22c55e; font-weight: bold;">FREE</span>
          </div>
          <div class="row">
            <span>GST (18% Luxury Tax):</span>
            <span>₹${Math.round(gstTax * 83).toLocaleString('en-IN')}</span>
          </div>
          <div class="row grand">
            <span>Grand Total Paid:</span>
            <span>₹${Math.round(grandTotal * 83).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing Bloom Luxury Florist. Your arrangement is handcrafted with rare, fresh botanicals.</p>
          <p style="margin-top: 4px;">Concierge Line: +91 (800) 555-BLOOM | Email: concierge@bloomluxury.com</p>
        </div>

        <div class="actions">
          <button class="btn" onclick="window.print()">Print / Save PDF</button>
          <button class="btn btn-close" onclick="window.close()">Close Window</button>
        </div>
      </div>
    </body>
    </html>
  `;

  invoiceWindow.document.open();
  invoiceWindow.document.write(invoiceHtml);
  invoiceWindow.document.close();
}
