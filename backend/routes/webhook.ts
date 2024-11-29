import express from 'express';
import { validateWebhook } from '../middleware/validateWebhook';
import Booking from '../models/Booking';
import { createNotification } from '../services/notificationService';

const router = express.Router();

router.post('/mercadopago', validateWebhook, async (req, res) => {
  try {
    const { data } = req.body;

    if (data.type === 'payment') {
      const paymentId = data.id;
      const booking = await Booking.findOne({ paymentId });

      if (booking) {
        const paymentStatus = data.status;

        if (paymentStatus === 'approved') {
          booking.status = 'confirmed';
          await booking.save();

          // Notify the professional and the client
          await createNotification(booking.professionalId, 'New booking confirmed', `You have a new booking on ${booking.date}`);
          await createNotification(booking.clientId, 'Booking confirmed', `Your booking for ${booking.date} has been confirmed`);
        } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
          booking.status = 'cancelled';
          await booking.save();

          // Notify the professional and the client
          await createNotification(booking.professionalId, 'Booking cancelled', `The booking for ${booking.date} has been cancelled`);
          await createNotification(booking.clientId, 'Booking cancelled', `Your booking for ${booking.date} has been cancelled`);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.sendStatus(500);
  }
});

export default router;

