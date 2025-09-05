import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CartService } from './cart.service';

const getCart = catchAsync(async (req: Request, res: Response) => {
    const result = await CartService.getCart(req.user.userId);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cart retrieved successfully",
        data: result
    });
});

const addToCart = catchAsync(async (req: Request, res: Response) => {
    const { productId, variant, quantity } = req.body;
    const result = await CartService.addToCart(req.user.userId, productId, variant, quantity);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Item added to cart successfully",
        data: result
    });
});

const updateCartItem = catchAsync(async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const result = await CartService.updateCartItem(req.user.userId, req.params.itemId, quantity);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cart item updated successfully",
        data: result
    });
});

const removeFromCart = catchAsync(async (req: Request, res: Response) => {
    const result = await CartService.removeFromCart(req.user.userId, req.params.itemId);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Item removed from cart successfully",
        data: result
    });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
    const result = await CartService.clearCart(req.user.userId);
    
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