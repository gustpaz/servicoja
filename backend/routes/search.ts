import express from 'express';
import Professional from '../models/Professional';
import { validateInput } from '../middleware/inputValidation';
import { query } from 'express-validator';

const router = express.Router();

router.get('/', [
  query('q').optional().isString(),
  query('category').optional().isString(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('rating').optional().isNumeric(),
  validateInput
], async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, rating } = req.query;

    let query: any = {};

    if (q) {
      query.$or = [
        { 'userId.name': { $regex: q, $options: 'i' } },
        { profession: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      query.profession = category;
    }

    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) query.hourlyRate.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    const professionals = await Professional.find(query)
      .populate('userId', 'name')
      .sort({ rating: -1 });

    res.json(professionals);
  } catch (error) {
    res.status(500).json({ message: 'Error searching professionals' });
  }
});

export default router;

