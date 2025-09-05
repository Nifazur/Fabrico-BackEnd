/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.createProduct(req.body);
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Product created successfully",
        data: result
    });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.getAllProducts(req.query as any);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products retrieved successfully",
        data: result.products,
        meta: result.meta
    });
});

const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.getProductBySlug(req.params.slug);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product retrieved successfully",
        data: result
    });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.updateProduct(req.params.slug, req.body);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product updated successfully",
        data: result
    });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await ProductService.deleteProduct(req.params.slug);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product deleted successfully",
        data: result
    });
});

export const ProductController = {
    createProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct
};