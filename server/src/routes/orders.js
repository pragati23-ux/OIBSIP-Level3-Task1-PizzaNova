import express from 'express';
import Order from '../models/Order.js';
import InventoryItem from '../models/InventoryItem.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/user/:userId', async (req, res) => {
  const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

router.post('/', async (req, res) => {
  try {
    const { userId, items, total, address, customerEmail, paymentStatus = 'pending', status = 'Order Received' } = req.body;
    const order = await Order.create({ user: userId, items, total, address, customerEmail, paymentStatus, status });

    const decrementOps = items.flatMap((item) => {
      const inventoryMapping = {
        'Margherita': ['pizza bases', 'sauces', 'cheeses'],
        'Pepperoni': ['pizza bases', 'sauces', 'cheeses', 'vegetables'],
        'Veggie': ['pizza bases', 'sauces', 'cheeses', 'vegetables']
      };
      return (inventoryMapping[item.name] || ['pizza bases']).map((name) => ({
        updateOne: {
          filter: { name },
          update: { $inc: { stock: -item.quantity } }
        }
      }));
    });

    if (decrementOps.length) {
      await InventoryItem.bulkWrite(decrementOps);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

export default router;
