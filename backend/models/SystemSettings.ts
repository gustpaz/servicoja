import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  systemName: { type: String, required: true, default: 'ServiçoJá' },
  logo: { type: String, required: true, default: '/default-logo.png' },
  primaryColor: { type: String, required: true, default: '#3B82F6' },
  secondaryColor: { type: String, required: true, default: '#1D4ED8' },
  contactEmail: { type: String, required: true, default: 'contato@servicoja.com' },
  contactPhone: { type: String, required: true, default: '(11) 1234-5678' },
});

export default mongoose.model('SystemSettings', systemSettingsSchema);

