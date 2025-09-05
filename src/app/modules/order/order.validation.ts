import { z } from 'zod';
import { PaymentMethod } from './order.interface';

const shippingAddressSchema = z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    country: z.string().min(2),
    zipCode: z.string().min(4)
});

export const createOrderValidationSchema = z.object({
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum([
        PaymentMethod.CASH_ON_DELIVERY,
        PaymentMethod.CARD,
        PaymentMethod.MOBILE_BANKING
    ]),
    notes: z.string().optional()
});

export const updateOrderStatusValidationSchema = z.object({
    orderStatus: z.string(),
    trackingNumber: z.string().optional(),
    estimatedDelivery: z.string().datetime().optional()
});