import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.createOrder(req.user.userId, req.body);
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order created successfully",
        data: result
    });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getMyOrders(req.user.userId, req.query);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result.orders,
        meta: result.meta
    });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderService.getAllOrders(req.query);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result.orders,
        meta: result.meta
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
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
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};