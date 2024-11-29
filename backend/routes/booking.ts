import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Booking from '../models/Booking';
import { createPaymentPreference, verifyPayment } from '../services/paymentService';
import { sendNotification } from '../services/notificationService';
import { AppError } from '../utils/AppError';
import { validateInput } from '../middleware/inputValidation';
import { body } from 'express-validator';

const router = express.Router();

router.post('/', [
  authMiddleware,
  body('professionalId').isMongoId(),
  body('date').isISO8601(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  validateInput
], async (req, res) => {
  try {
    const { professionalId, date, startTime, endTime } = req.body;
    
    // Calculate booking details (duration, price, etc.)
    const bookingDetails = await calculateBookingDetails(professionalId, date, startTime, endTime);

    // Create payment preference
    const paymentUrl = await createPaymentPreference({
      ...bookingDetails,
      clientId: req.user._id,
    });

    res.json({ paymentUrl });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error creating booking' });
    }
  }
});

router.post('/confirm', [
  authMiddleware,
  body('paymentId').isString(),
  validateInput
], async (req, res) => {
  try {
    const { paymentId } = req.body;

    // Verify payment
    const isPaymentValid = await verifyPayment(paymentId);
    if (!isPaymentValid) {
      throw new AppError('Invalid payment', 400);
    }

    // Create booking
    const bookingData = JSON.parse(req.body.bookingData);
    const booking = new Booking({
      clientId: req.user._id,
      professionalId: bookingData.professionalId,
      date: bookingData.date,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      totalPrice: bookingData.totalPrice,
      status: 'confirmed',
    });
    await booking.save();

    // Send notifications
    sendNotification(booking.professionalId, {
      type: 'new_booking',
      message: 'You have a new booking',
      bookingId: booking._id,
    });

    res.json({ message: 'Booking confirmed successfully', bookingId: booking._id });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error confirming booking' });
    }
  }
});

export default router;

