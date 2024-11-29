import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { apiLimiter, authLimiter } from './middleware/rateLimiter'
import authRoutes from './routes/auth'
import professionalRoutes from './routes/professionals'
import chatRoutes from './routes/chat'
import bookingRoutes from './routes/booking'
import adminRoutes from './routes/admin'
import fileUploadRoutes from './routes/fileUpload'
import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger'
import { errorHandler } from './middleware/errorHandler'
import logger from './config/logger'
import PlatformSettings from './models/PlatformSettings'
import { Server } from 'http'
import WebSocket from 'ws'
import { connectWebSocket, disconnectWebSocket } from './services/notificationService'
import jwt from 'jsonwebtoken'
import serviceCategoryRoutes from './routes/serviceCategories'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Apply rate limiting to all requests
app.use(apiLimiter)

// Apply stricter rate limiting to authentication routes
app.use('/api/auth', authLimiter)

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/professionals', professionalRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', fileUploadRoutes)
app.use('/api/service-categories', serviceCategoryRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// Error handling middleware
app.use(errorHandler)

async function loadPlatformSettings() {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = new PlatformSettings({
        platformFeePercentage: 10,
        featuredListingPrice: 50,
        featuredListingDuration: 7,
        mercadoPagoAccessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
        mercadoPagoPublicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
      });
      await settings.save();
    }
    logger.info('Platform settings loaded');
  } catch (error) {
    logger.error('Error loading platform settings:', error);
  }
}

const PORT = process.env.PORT || 5000
const server = new Server(app)

const wss = new WebSocket.Server({ server })

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    if (data.type === 'auth') {
      try {
        const decoded = jwt.verify(data.token, process.env.JWT_SECRET as string) as { userId: string };
        connectWebSocket(ws, decoded.userId);
      } catch (error) {
        ws.close();
      }
    }
  });

  ws.on('close', () => {
    if ((ws as any).userId) {
      disconnectWebSocket((ws as any).userId);
    }
  });
});

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  loadPlatformSettings()
})

