import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import pizzaRoutes from './routes/pizzas.js';
import orderRoutes from './routes/orders.js';
import inventoryRoutes from './routes/inventory.js';
import User from './models/User.js';
import Pizza from './models/Pizza.js';
import InventoryItem from './models/InventoryItem.js';
import { sendLowStockAlert } from './utils/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

cron.schedule('0 * * * *', async () => {
  await sendLowStockAlert();
});

const seedData = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzadelivery.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({ name: 'Admin', email: adminEmail, password: hashedPassword, role: 'admin', isVerified: true });
  }

  const pizzaCount = await Pizza.countDocuments();
  if (pizzaCount === 0) {
    await Promise.all([
      Pizza.create({ name: 'Margherita', description: 'Classic tomato, mozzarella, basil', price: 12, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', ingredients: ['pizza bases', 'sauces', 'cheeses'] }),
      Pizza.create({ name: 'Pepperoni', description: 'Pepperoni, mozzarella, roasted peppers', price: 15, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80', ingredients: ['pizza bases', 'sauces', 'cheeses', 'vegetables'] }),
      Pizza.create({ name: 'Veggie', description: 'Mushroom, spinach, olives, onions', price: 14, image: 'https://images.unsplash.com/photo-1517278350602-c3f95b6dbf6d?auto=format&fit=crop&w=600&q=80', ingredients: ['pizza bases', 'sauces', 'cheeses', 'vegetables'] })
    ]);
  }

  const inventoryCount = await InventoryItem.countDocuments();
  if (inventoryCount === 0) {
    await Promise.all([
      InventoryItem.create({ name: 'pizza bases', stock: 30, threshold: 20 }),
      InventoryItem.create({ name: 'sauces', stock: 40, threshold: 20 }),
      InventoryItem.create({ name: 'cheeses', stock: 35, threshold: 20 }),
      InventoryItem.create({ name: 'vegetables', stock: 25, threshold: 20 })
    ]);
  }
};

const bootstrap = async () => {
  await seedData();
  app.listen(port, () => console.log(`Server running on port ${port}`));
};

bootstrap().catch((error) => {
  console.error('Server startup failed', error);
  process.exit(1);
});
