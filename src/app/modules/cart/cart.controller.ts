/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CartService } from './cart.service';
import { JwtPayload } from 'jsonwebtoken';

const getCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await CartService.getCart(decodedToken.userId);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cart retrieved successfully",
        data: result
    });
});

const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId, variant, quantity } = req.body;
    const decodedToken = req.user as JwtPayload
    const result = await CartService.addToCart(decodedToken.userId, productId, variant, quantity);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Item added to cart successfully",
        data: result
    });
});

const updateCartItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { quantity } = req.body;
    const decodedToken = req.user as JwtPayload
    const result = await CartService.updateCartItem(decodedToken.userId, req.params.itemId, quantity);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cart item updated successfully",
        data: result
    });
});

const removeFromCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await CartService.removeFromCart(decodedToken.userId, req.params.itemId);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Item removed from cart successfully",
        data: result
    });
});

const clearCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await CartService.clearCart(decodedToken.userId);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cart cleared successfully",
        data: result
    });
});

export const CartController = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};