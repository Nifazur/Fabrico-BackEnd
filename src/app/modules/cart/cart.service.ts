/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../errorHelpers/AppError';
import { Cart } from './cart.model';
import { Product } from '../product/product.model';

const getCart = async (userId: string) => {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    
    return cart;
};

const addToCart = async (userId: string, productId: string, variant: any, quantity: number) => {
    const product = await Product.findById(productId);
    
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    
    const productVariant = product.variants.find(
        v => v.size === variant.size && v.color === variant.color && v.sku === variant.sku
    );
    
    if (!productVariant) {
        throw new AppError(httpStatus.BAD_REQUEST, "Product variant not found");
    }
    
    if (productVariant.stock < quantity) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock");
    }
    
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    
    const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId && 
                item.variant.sku === variant.sku
    );
    
    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Don't include _id when pushing new items
        cart.items.push({
            product: new Types.ObjectId(productId),
            variant,
            quantity,
            price: product.price
        } as any); // Cast to any to avoid _id requirement
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    return cart;
};

const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
        throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
    }
    
    const itemIndex = cart.items.findIndex(item => item._id?.toString() === itemId);
    
    if (itemIndex === -1) {
        throw new AppError(httpStatus.NOT_FOUND, "Cart item not found");
    }
    
    const product = await Product.findById(cart.items[itemIndex].product);
    const variant = product?.variants.find(v => v.sku === cart.items[itemIndex].variant.sku);
    
    if (!variant || variant.stock < quantity) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock");
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    
    return cart;
};

const removeFromCart = async (userId: string, itemId: string) => {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
        throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
    }
    
    cart.items = cart.items.filter(item => item._id?.toString() !== itemId);
    await cart.save();
    await cart.populate('items.product');
    
    return cart;
};

const clearCart = async (userId: string) => {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
        throw new AppError(httpStatus.NOT_FOUND, "Cart not found");
    }
    
    cart.items = [];
    await cart.save();
    
    return cart;
};

export const CartService = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};