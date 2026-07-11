import express from 'express';
import InventoryItem from '../models/InventoryItem.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const items = await InventoryItem.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create inventory item', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update inventory item', error: error.message });
  }
});

export default router;
