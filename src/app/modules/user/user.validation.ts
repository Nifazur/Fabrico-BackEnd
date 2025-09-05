import { z } from 'zod';

const addressSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional()
});

export const updateProfileValidationSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: addressSchema.optional(),
    picture: z.string().url().optional()
});

export const changePasswordValidationSchema = z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6)
});