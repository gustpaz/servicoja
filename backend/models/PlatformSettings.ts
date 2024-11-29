import mongoose from 'mongoose';

const platformSettingsSchema = new mongoose.Schema({
  platformFeePercentage: { type: Number, required: true, min: 0, max: 100 },
  featuredListingPrice: { type: Number, required: true, min: 0 },
  featuredListingDuration: { type: Number, required: true, min: 1 }, // in days
  mercadoPagoAccessToken: { type: String, required: true },
  mercadoPagoPublicKey: { type: String, required: true },
});

export default mongoose.model('PlatformSettings', platformSettingsSchema);

