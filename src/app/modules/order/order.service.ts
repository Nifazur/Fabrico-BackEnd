import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { Order } from './order.model';
import { Cart } from '../cart/cart.model';
import { Product } from '../product/product.model';
import { IOrder, OrderStatus, PaymentStatus } from './order.interface';

const createOrder = async (userId: string, orderData: Partial<IOrder>) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
    }
    
    // Verify stock availability
    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        const variant = product?.variants.find(v => v.sku === item.variant.sku);
        
        if (!variant || variant.stock < item.quantity) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                `Insufficient stock for ${product?.name}`
            );
        }
    }
    
    // Calculate totals
    const subtotal = cart.totalPrice || 0;
    const shippingCost = subtotal > 1000 ? 0 : 100; // Free shipping over 1000
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingCost + tax;
    
    // Create order items
    const orderItems = cart.items.map(item => ({
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
    }));
    
    // Create order
    const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        notes: orderData.notes
    });
    
    // Update product stock
    for (const item of cart.items) {
        await Product.findOneAndUpdate(
            { 
                _id: item.product,
                'variants.sku': item.variant.sku
            },
            {
                $inc: { 'variants.$.stock': -item.quantity }
            }
        );
    }
    
    // Clear cart
    await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
    );
    
    return order;
};

const getMyOrders = async (userId: string, query: any) => {
    const { page = 1, limit = 10, status } = query;
    
    const filter: any = { user: userId };
    if (status) filter.orderStatus = status;
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(filter)
        .populate('items.product', 'name images slug')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt');
    
    const total = await Order.countDocuments(filter);
    
    return {
        orders,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getAllOrders = async (query: any) => {
    const { page = 1, limit = 10, status, paymentStatus } = query;
    
    const filter: any = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(filter)
        .populate('user', 'name email')
        .populate('items.product', 'name')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt');
    
    const total = await Order.countDocuments(filter);
    
    return {
        orders,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const updateOrderStatus = async (orderId: string, updateData: any) => {
    const order = await Order.findById(orderId);
    
    if (!order) {
        throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }
    
    if (updateData.orderStatus) {
        order.orderStatus = updateData.orderStatus;
        
        if (updateData.orderStatus === OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
            order.paymentStatus = PaymentStatus.PAID;
        }
        
        if (updateData.orderStatus === OrderStatus.CANCELLED) {
            // Restore product stock
            for (const item of order.items) {
                await Product.findOneAndUpdate(
                    {
                        _id: item.product,
                        'variants.sku': item.variant.sku
                    },
                    {
                        $inc: { 'variants.$.stock': item.quantity }
                    }
                );
            }
        }
    }
    
    if (updateData.trackingNumber) {
        order.trackingNumber = updateData.trackingNumber;
    }
    
    if (updateData.estimatedDelivery) {
        order.estimatedDelivery = updateData.estimatedDelivery;
    }
    
    await order.save();
    return order;
};

export const OrderService = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};