import express from 'express';
import Pizza from '../models/Pizza.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const pizzas = await Pizza.find();
  res.json(pizzas);
});

router.post('/', async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create pizza', error: error.message });
  }
});

export default router;
