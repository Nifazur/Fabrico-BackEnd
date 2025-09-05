import { Schema, model } from 'mongoose';
import { IOrder, OrderStatus, PaymentStatus, PaymentMethod } from './order.interface';

const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    variant: {
        size: { type: String, required: true },
        color: { type: String, required: true },
        sku: { type: String, required: true }
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { _id: false });

const shippingAddressSchema = new Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
        required: true
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },
    orderStatus: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING
    },
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    notes: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date
}, {
    timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const count = await model('Order').countDocuments();
        this.orderNumber = `ORD${Date.now()}${count + 1}`;
    }
    next();
});

export const Order = model<IOrder>('Order', orderSchema);