import { z } from 'zod';

const productVariantSchema = z.object({
    size: z.string().min(1),
    color: z.string().min(1),
    stock: z.number().min(0),
    sku: z.string().min(1)
});

export const createProductValidationSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    category: z.string().min(1),
    subcategory: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().positive(),
    comparePrice: z.number().positive().optional(),
    images: z.array(z.string().url()).min(1),
    variants: z.array(productVariantSchema).min(1),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional()
});

export const updateProductValidationSchema = createProductValidationSchema.partial();