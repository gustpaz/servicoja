import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import Dispute from '../models/Dispute';
import Booking from '../models/Booking';
import User from '../models/User';
import Professional from '../models/Professional';
import Chat from '../models/Chat';
import PlatformSettings from '../models/PlatformSettings';
import SystemSettings from '../models/SystemSettings';
import { uploadFile } from '../services/fileUploadService';
import { validateInput } from '../middleware/inputValidation';
import { body } from 'express-validator';

const router = express.Router();

// Middleware para garantir que apenas administradores acessem essas rotas
router.use(authMiddleware, adminMiddleware);

// Rota para obter todas as disputas
router.get('/disputes', async (req, res) => {
  try {
    const disputes = await Dispute.find().populate('clientId', 'name').populate('professionalId', 'name');
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar disputas' });
  }
});

// Rota para resolver uma disputa
router.patch('/disputes/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const dispute = await Dispute.findByIdAndUpdate(id, { status: 'resolved', resolution }, { new: true });
    res.json(dispute);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao resolver disputa' });
  }
});

// Rota para atualizar o status de uma disputa
router.patch('/disputes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const dispute = await Dispute.findByIdAndUpdate(id, { status }, { new: true });
    res.json(dispute);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status da disputa' });
  }
});

// Rota para gerar relatórios
router.get('/reports', async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    let reportData: any = {};

    // Dados comuns para todos os relatórios
    const totalBookings = await Booking.countDocuments({ createdAt: { $gte: start, $lte: end } });
    const totalRevenue = await Booking.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    reportData.totalBookings = totalBookings;
    reportData.totalRevenue = totalRevenue[0]?.total || 0;

    switch (type) {
      case 'bookings':
      case 'revenue':
        const bookingsByDate = await Booking.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          { $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }},
          { $sort: { _id: 1 } }
        ]);
        reportData.revenueByDate = bookingsByDate.map(item => ({
          date: item._id,
          count: item.count,
          revenue: item.revenue
        }));
        break;

      case 'professionals':
        const topProfessionals = await Booking.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: '$professionalId', bookings: { $sum: 1 } } },
          { $sort: { bookings: -1 } },
          { $limit: 10 },
          { $lookup: { from: 'professionals', localField: '_id', foreignField: '_id', as: 'professional' } },
          { $unwind: '$professional' },
          { $lookup: { from: 'users', localField: 'professional.userId', foreignField: '_id', as: 'user' } },
          { $unwind: '$user' },
          { $project: { name: '$user.name', bookings: 1 } }
        ]);
        reportData.topProfessionals = topProfessionals;
        break;

      case 'categories':
        const bookingsByCategory = await Booking.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          { $lookup: { from: 'professionals', localField: 'professionalId', foreignField: '_id', as: 'professional' } },
          { $unwind: '$professional' },
          { $group: { _id: '$professional.profession', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        reportData.bookingsByCategory = bookingsByCategory.map(item => ({
          category: item._id,
          count: item.count
        }));
        break;
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar relatório' });
  }
});

router.get('/chats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('participants', 'name')
      .sort({ 'messages.timestamp': -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

router.get('/chats/:chatId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name')
      .populate('messages.sender', 'name');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    chat.reviewedByAdmin = true;
    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat' });
  }
});

// Get platform settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = new PlatformSettings({
        platformFeePercentage: 10,
        featuredListingPrice: 50,
        featuredListingDuration: 7,
        mercadoPagoAccessToken: '',
        mercadoPagoPublicKey: '',
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform settings' });
  }
});

// Update platform settings
router.put('/settings', async (req, res) => {
  try {
    const { platformFeePercentage, featuredListingPrice, featuredListingDuration, mercadoPagoAccessToken, mercadoPagoPublicKey } = req.body;
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = new PlatformSettings();
    }
    settings.platformFeePercentage = platformFeePercentage;
    settings.featuredListingPrice = featuredListingPrice;
    settings.featuredListingDuration = featuredListingDuration;
    settings.mercadoPagoAccessToken = mercadoPagoAccessToken;
    settings.mercadoPagoPublicKey = mercadoPagoPublicKey;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating platform settings' });
  }
});

router.get('/system-settings', async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar configurações do sistema' });
  }
});

router.put('/system-settings', [
  body('systemName').isString().notEmpty(),
  body('primaryColor').isString().notEmpty(),
  body('secondaryColor').isString().notEmpty(),
  body('contactEmail').isEmail(),
  body('contactPhone').isString().notEmpty(),
  validateInput
], async (req, res) => {
  try {
    const { systemName, primaryColor, secondaryColor, contactEmail, contactPhone } = req.body;
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }
    settings.systemName = systemName;
    settings.primaryColor = primaryColor;
    settings.secondaryColor = secondaryColor;
    settings.contactEmail = contactEmail;
    settings.contactPhone = contactPhone;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar configurações do sistema' });
  }
});

router.post('/system-settings/logo', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    const logoUrl = await uploadFile(req.file);
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings();
    }
    settings.logo = logoUrl;
    await settings.save();
    res.json({ logo: logoUrl });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o logotipo' });
  }
});

export default router;

