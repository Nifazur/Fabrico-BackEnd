import { Types } from 'mongoose';

export interface ICartItem {
    _id: string;
    product: Types.ObjectId;
    variant: {
        size: string;
        color: string;
        sku: string;
    };
    quantity: number;
    price: number;
}

export interface ICart {
    _id?: string;
    user: Types.ObjectId;
    items: ICartItem[];
    totalItems?: number;
    totalPrice?: number;
    createdAt?: Date;
    updatedAt?: Date;
}