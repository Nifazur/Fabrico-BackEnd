import { Types } from 'mongoose';

export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export enum PaymentMethod {
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
    CARD = "CARD",
    MOBILE_BANKING = "MOBILE_BANKING"
}

export interface IOrderItem {
    product: Types.ObjectId;
    variant: {
        size: string;
        color: string;
        sku: string;
    };
    quantity: number;
    price: number;
    total: number;
}

export interface IShippingAddress {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface IOrder {
    _id?: string;
    orderNumber?: string;
    user: Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    notes?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    deliveredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}