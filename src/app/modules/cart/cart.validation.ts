import { z } from 'zod';

export const addToCartValidationSchema = z.object({
    productId: z.string().min(1),
    variant: z.object({
        size: z.string().min(1),
        color: z.string().min(1),
        sku: z.string().min(1)
    }),
    quantity: z.number().int().positive()
});

export const updateCartItemValidationSchema = z.object({
    quantity: z.number().int().positive()
});