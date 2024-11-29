import mongoose from 'mongoose';
import Professional from '../models/Professional';
import { createNotification } from '../services/notificationService';

async function checkFeaturedListings() {
  try {
    const now = new Date();
    const expiredFeatured = await Professional.find({
      featuredUntil: { $lt: now, $ne: null }
    });

    for (const professional of expiredFeatured) {
      professional.featuredUntil = null;
      await professional.save();

      await createNotification(
        professional.userId,
        'Featured listing expired',
        'Your featured listing has expired. Renew it to maintain top visibility.'
      );
    }

    console.log(`Updated ${expiredFeatured.length} expired featured listings`);
  } catch (error) {
    console.error('Error checking featured listings:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkFeaturedListings();

