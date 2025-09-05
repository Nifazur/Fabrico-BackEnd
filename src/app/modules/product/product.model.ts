import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productVariantSchema = new Schema({
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    sku: {
        type: String,
        required: true,
        unique: true
    }
}, { _id: false });

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: String,
    brand: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    comparePrice: {
        type: Number,
        min: 0
    },
    images: [{
        type: String,
        required: true
    }],
    variants: [productVariantSchema],
    tags: [String],
    featured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalStock: {
        type: Number,
        default: 0
    },
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate total stock before saving
productSchema.pre('save', function(next) {
    this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
    next();
});

// Generate slug from name
productSchema.pre('save', function(next) {
    if (!this.slug && this.name) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    next();
});

export const Product = model<IProduct>('Product', productSchema);