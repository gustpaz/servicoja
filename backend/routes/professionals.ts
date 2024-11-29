import express from 'express';
import Professional from '../models/Professional';
import PlatformSettings from '../models/PlatformSettings';
import { authMiddleware } from '../middleware/auth';
import mercadopago from 'mercadopago';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const professionals = await Professional.find().populate('userId', 'name');
    res.json(professionals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professionals' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id).populate('userId', 'name');
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }
    res.json(professional);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professional' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { profession, description, hourlyRate, availability } = req.body;
    const professional = new Professional({
      userId: req.user._id,
      profession,
      description,
      hourlyRate,
      availability
    });
    await professional.save();
    res.status(201).json(professional);
  } catch (error) {
    res.status(500).json({ message: 'Error creating professional profile' });
  }
});

router.post('/featured-listing', authMiddleware, async (req, res) => {
  try {
    const professional = await Professional.findOne({ userId: req.user._id });
    if (!professional) {
      return res.status(404).json({ message: 'Professional profile not found' });
    }

    const settings = await PlatformSettings.findOne();
    if (!settings) {
      return res.status(500).json({ message: 'Platform settings not found' });
    }

    mercadopago.configure({
      access_token: settings.mercadoPagoAccessToken
    });

    const preference = {
      items: [
        {
          title: 'Featured Listing',
          unit_price: settings.featuredListingPrice,
          quantity: 1,
        }
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/professional/featured-success`,
        failure: `${process.env.FRONTEND_URL}/professional/featured-failure`,
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    res.status(500).json({ message: 'Error creating featured listing payment' });
  }
});

router.post('/featured-listing/success', authMiddleware, async (req, res) => {
  try {
    const { payment_id, status } = req.query;
    if (status === 'approved') {
      const professional = await Professional.findOne({ userId: req.user._id });
      if (!professional) {
        return res.status(404).json({ message: 'Professional profile not found' });
      }

      const settings = await PlatformSettings.findOne();
      if (!settings) {
        return res.status(500).json({ message: 'Platform settings not found' });
      }

      professional.featuredUntil = new Date(Date.now() + settings.featuredListingDuration * 24 * 60 * 60 * 1000);
      await professional.save();

      res.json({ message: 'Featured listing activated successfully' });
    } else {
      res.status(400).json({ message: 'Payment not approved' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing featured listing payment' });
  }
});

export default router;

