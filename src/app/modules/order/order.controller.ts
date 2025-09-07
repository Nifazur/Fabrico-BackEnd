/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { OrderService } from './order.service';
import { JwtPayload } from 'jsonwebtoken';

const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await OrderService.createOrder(decodedToken.userId, req.body);
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order created successfully",
        data: result
    });
});

const getOrderById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await OrderService.getOrderById(req.params.orderNumber);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Oder retrieved successfully",
        data: result
    });
});

const getMyOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await OrderService.getMyOrders(decodedToken.userId, req.query);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result.orders,
        meta: result.meta
    });
});

const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await OrderService.getAllOrders(req.query);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result.orders,
        meta: result.meta
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await OrderService.updateOrderStatus(req.params.id, req.body);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order status updated successfully",
        data: result
    });
});

export const OrderController = {
    createOrder,
    getOrderById,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};