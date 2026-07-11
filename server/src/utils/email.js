import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import InventoryItem from '../models/InventoryItem.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendLowStockAlert = async () => {
  const lowStockItems = await InventoryItem.find({ stock: { $lt: 20 } });
  if (!lowStockItems.length) return;

  const message = {
    from: process.env.SMTP_FROM || 'no-reply@pizzadelivery.com',
    to: process.env.ADMIN_EMAIL || 'admin@pizzadelivery.com',
    subject: 'Low stock alert for Pizza Delivery',
    text: lowStockItems.map((item) => `${item.name}: ${item.stock} units remaining`).join('\n')
  };

  try {
    await transporter.sendMail(message);
    console.log('Low stock alert sent');
  } catch (error) {
    console.error('Failed to send low stock alert', error);
  }
};
