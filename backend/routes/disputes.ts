import express from 'express';
import { authMiddleware } from '../middleware/auth';
import Dispute from '../models/Dispute';
import Booking from '../models/Booking';
import { createNotification } from '../services/notificationService';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { bookingId, reason } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const dispute = new Dispute({
      bookingId,
      clientId: req.user._id,
      professionalId: booking.professionalId,
      reason,
      status: 'pending'
    });

    await dispute.save();

    // Notify admin and professional
    await createNotification('admin', 'New dispute opened', `A new dispute has been opened for booking ${bookingId}`);
    await createNotification(booking.professionalId, 'Dispute opened', `A dispute has been opened for your booking on ${booking.date}`);

    res.status(201).json(dispute);
  } catch (error) {
    res.status(500).json({ message: 'Error creating dispute' });
  }
});

export default router;

