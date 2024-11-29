import mercadopago from 'mercadopago';
import { AppError } from '../utils/AppError';
import PlatformSettings from '../models/PlatformSettings';
import logger from './logService';

export async function createPaymentPreference(bookingData: any) {
  try {
    const settings = await PlatformSettings.findOne();
    if (!settings || !settings.mercadoPagoAccessToken) {
      throw new AppError('MercadoPago settings not configured', 500);
    }

    mercadopago.configure({
      access_token: settings.mercadoPagoAccessToken
    });

    const preference = {
      items: [
        {
          title: `Booking with ${bookingData.professionalName}`,
          unit_price: bookingData.totalPrice,
          quantity: 1,
        }
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/booking/success`,
        failure: `${process.env.FRONTEND_URL}/booking/failure`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify(bookingData),
    };

    const response = await mercadopago.preferences.create(preference);
    logger.info(`Payment preference created for booking: ${bookingData._id}`);
    return response.body.init_point;
  } catch (error) {
    logger.error('Error creating payment preference:', error);
    throw new AppError('Failed to create payment preference', 500);
  }
}

export async function verifyPayment(paymentId: string) {
  try {
    const settings = await PlatformSettings.findOne();
    if (!settings || !settings.mercadoPagoAccessToken) {
      throw new AppError('MercadoPago settings not configured', 500);
    }

    mercadopago.configure({
      access_token: settings.mercadoPagoAccessToken
    });

    const payment = await mercadopago.payment.get(paymentId);
    logger.info(`Payment verified: ${paymentId}, status: ${payment.body.status}`);
    return payment.body.status === 'approved';
  } catch (error) {
    logger.error('Error verifying payment:', error);
    throw new AppError('Failed to verify payment', 500);
  }
}

