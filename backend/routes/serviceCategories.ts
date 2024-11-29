import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import ServiceCategory from '../models/ServiceCategory';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await ServiceCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service categories' });
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const category = new ServiceCategory({ name, description, icon });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service category' });
  }
});

export default router;

