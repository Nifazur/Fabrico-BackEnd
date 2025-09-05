/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { Product } from './product.model';
import { IProduct, IProductQuery } from './product.interface';

const createProduct = async (payload: IProduct) => {
    const existingProduct = await Product.findOne({ slug: payload.slug });
    
    if (existingProduct) {
        throw new AppError(httpStatus.CONFLICT, "Product with this slug already exists");
    }
    
    const product = await Product.create(payload);
    return product;
};

const getAllProducts = async (query: IProductQuery) => {
    const {
        search,
        category,
        subcategory,
        size,
        color,
        minPrice,
        maxPrice,
        brand,
        sort = '-createdAt',
        page = 1,
        limit = 12
    } = query;
    
    const filter: any = { isActive: true };
    
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];
    }
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (brand) filter.brand = brand;
    
    if (size) {
        filter['variants.size'] = size;
    }
    
    if (color) {
        filter['variants.color'] = color;
    }
    
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort);
    
    const total = await Product.countDocuments(filter);
    
    return {
        products,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getProductBySlug = async (slug: string) => {
    const product = await Product.findOne({ slug, isActive: true });
    
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    
    return product;
};

const updateProduct = async (slug: string, payload: Partial<IProduct>) => {
    const product = await Product.findOneAndUpdate(
        { slug },
        { $set: payload },
        { new: true, runValidators: true }
    );
    
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    
    return product;
};

const deleteProduct = async (slug: string) => {
    const product = await Product.findOneAndUpdate(
        { slug },
        { isActive: false },
        { new: true }
    );
    
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
    
    return product;
};

export const ProductService = {
    createProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct
};